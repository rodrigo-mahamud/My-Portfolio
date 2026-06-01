import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

/**
 * Idempotent migration of the legacy MDX project pages into the Payload `works`
 * collection. Re-runnable: media is reused by filename, works are upserted by slug.
 *
 * Run from backend/:  npx tsx src/utils/migrate-works.ts
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const MEDIA_DIRS = [
  path.resolve(__dirname, '../../../frontend/public'),
  path.resolve(__dirname, '../../../frontend/src/assets/works'),
]

// ---------------------------------------------------------------------------
// Lexical rich-text helpers
// ---------------------------------------------------------------------------
type Lex = Record<string, any>

const txt = (text: string, format = 0): Lex => ({
  mode: 'normal',
  text,
  type: 'text',
  style: '',
  detail: 0,
  format,
  version: 1,
})
const bold = (t: string): Lex => txt(t, 1)
const italic = (t: string): Lex => txt(t, 2)
const boldItalic = (t: string): Lex => txt(t, 3)

const mkLink = (url: string, children: Lex[], newTab = true): Lex => ({
  type: 'link',
  version: 3,
  format: '',
  indent: 0,
  direction: 'ltr',
  fields: { linkType: 'custom', url, newTab },
  children,
})
const link = (t: string, url: string, newTab = true): Lex => mkLink(url, [txt(t)], newTab)

const lineBreak = (): Lex => ({ type: 'linebreak', version: 1 })

const para = (...children: Lex[]): Lex => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  textStyle: '',
  textFormat: 0,
  children: children.length ? children : [txt('')],
})

const list = (tag: 'ul' | 'ol', items: Lex[][]): Lex => ({
  type: 'list',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  listType: tag === 'ol' ? 'number' : 'bullet',
  start: 1,
  tag,
  children: items.map((inline, i) => ({
    type: 'listitem',
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
    value: i + 1,
    children: inline,
  })),
})

const doc = (...children: Lex[]): Lex => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children },
})
const richText = (...texts: string[]): Lex => doc(...texts.map((t) => para(txt(t))))

// ---------------------------------------------------------------------------
// Block builders (pure)
// ---------------------------------------------------------------------------
const infoBlock = (o: {
  rol: string
  status: string
  duration: string
  overview: Lex
  title?: string
  team?: Lex
}): Lex => ({
  blockType: 'singlePostInfo',
  rol: o.rol,
  status: o.status,
  duration: o.duration,
  overview: o.overview,
  title: o.title,
  team: o.team,
})

const sectionBlock = (preTitle: string, title: string, content: Lex): Lex => ({
  blockType: 'singlePostSection',
  preTitle,
  title,
  content,
})

const rtBlock = (content: Lex): Lex => ({ blockType: 'richText', content })

const mediaBlock = (
  mediaFile: string,
  caption: Lex,
  opts: { frame?: boolean; layout?: 'single' | 'half'; delay?: number } = {},
): Lex => ({
  blockType: 'postMedia',
  mediaFile,
  caption,
  frame: opts.frame !== false,
  layout: opts.layout || 'single',
  delay: opts.delay ?? 0.25,
})

const galleryBlock = (items: Array<{ mediaFile: string; title: string; subtitle: string }>): Lex => ({
  blockType: 'postGalleryGrid',
  mediaType: 'videos',
  columns: '2',
  items,
})

const cardsBlock = (cards: any[]): Lex => ({ blockType: 'postCards', cards })
const statsBlock = (stats: any[]): Lex => ({ blockType: 'stats', stats, layout: 'grid' })
const nextBlock = (nextProject: string | null): Lex[] =>
  nextProject ? [{ blockType: 'postNextProject', nextProject }] : []

const buildTeam = (groups: Array<{ role: string; members: string[] }>): Lex => {
  const children: Lex[] = []
  for (const g of groups) {
    if (g.members.length === 1) {
      children.push(bold(g.role), txt(` - ${g.members[0]}`), lineBreak(), lineBreak())
    } else {
      children.push(bold(g.role), lineBreak())
      for (const m of g.members) children.push(txt(`- ${m}`), lineBreak())
      children.push(lineBreak())
    }
  }
  return doc(para(...children))
}

// ---------------------------------------------------------------------------
// Media upload (idempotent by filename)
// ---------------------------------------------------------------------------
function resolveAsset(filename: string): string {
  const base = filename.replace(/^\//, '')
  for (const dir of MEDIA_DIRS) {
    const candidate = path.join(dir, base)
    if (fs.existsSync(candidate)) return candidate
  }
  throw new Error(`Asset not found in known dirs: ${filename}`)
}

async function uploadMedia(payload: any, filename: string, alt: string): Promise<string> {
  const base = filename.replace(/^\//, '')
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: base } },
    limit: 1,
  })
  if (existing.docs.length > 0) return existing.docs[0].id

  const media = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: resolveAsset(filename),
  })
  console.log(`  ↑ uploaded media: ${base}`)
  return media.id
}

// ---------------------------------------------------------------------------
// Per-project definitions
// ---------------------------------------------------------------------------
type Ctx = { workIdBySlug: (slug: string) => Promise<string | null> }

interface WorkDef {
  slug: string
  title: string
  author: string
  excerpt: string
  publishDate: string
  accentColor: string
  canonical?: string
  heroImage: string
  postIndex: string[]
  buildLayout: (payload: any, ctx: Ctx) => Promise<Lex[]>
}

const AUTHOR = 'Rodrigo Mahamud García'
const CANONICAL = 'https://astrowind.vercel.app/get-started-website-with-astro-tailwind-css'

// --- Hotel Benetusser & Skola la Latina share an identical body in the MDX ---
async function hotelStyleLayout(
  payload: any,
  ctx: Ctx,
  info: { rol: string; duration: string },
): Promise<Lex[]> {
  const demo = await uploadMedia(payload, '/hotelBenetusser.mp4', 'Hotel Benetusser website demo')
  const perf1 = await uploadMedia(payload, 'rendimientoHB1.png', 'PageSpeed Insights performance report')
  const perf2 = await uploadMedia(payload, 'rendimientoHB2.png', 'GTmetrix performance report')

  const galleryClips: Array<[string, string, string]> = [
    ['benetusserClip1.mp4', 'Room image gallery.', 'Component with on hover animations that shows at a glance all the rooms offered by the hotel.'],
    ['benetusserClip2.mp4', 'Contextual mouse animations.', 'Mouse-based micro-interactions for highlighting links, buttons, or videos.'],
    ['benetusserClip4.mp4', 'Parallax on scroll animations.', "Images with parallax effect to capture the user's attention."],
    ['benetusserClip3.mp4', 'Initial hero section animation.', "The website's hero animation features hotel images to immediately grab attention, aiming for an elegant and sophisticated first impression."],
    ['benetusserClip5.mp4', 'On scroll animations.', "The website uses scroll-triggered animations and Lennis Scrollbar to ensure a smooth user experience, maintaining accessibility because Lennis Scrollbar uses the browser's native scroll, unlike other libraries."],
  ]
  const items = []
  for (const [file, title, subtitle] of galleryClips) {
    items.push({ mediaFile: await uploadMedia(payload, file, title), title, subtitle })
  }

  return [
    infoBlock({
      rol: info.rol,
      status: 'done',
      duration: info.duration,
      overview: richText(
        'For this project, I was tasked with completely overhauling the hotelbenetusser.net website. The previous design, over 20 years old, required a comprehensive update to rejuvenate the client’s online presence.',
        'The goal was to create a fully static website, serving merely as a virtual showcase to attract customers. One of the main challenges was to achieve outstanding performance and add bilingual support for two languages. To accomplish this project, I used AstroJS and TailwindCSS for design and development, complemented with GSAP to enrich the site with animations and micro-interactions.',
      ),
    }),
    sectionBlock(
      'Context',
      'The goals: New look & Speed',
      richText(
        "The main goal of this project was to revitalize the client’s static website, focusing not only on modernizing its interface but also on significantly boosting its performance, which was particularly important given the site’s purpose of attracting customers. A high-performing website is essential for achieving a prominent position in Google search results, thus enhancing visibility and attracting more potential clients. Additionally, incorporating multilingual support for Spanish and English was crucial, necessitating the use of an internationalization (i18n) library.",
        'With these priorities in mind, I opted for Astro, an ideal framework for developing static and swiftly loading websites. Astro offers several built-in optimizations, like the “islands” or “deferred hydration” concept, which notably improve the site’s performance. To further support these goals, tools such as astro-compress, astro-sitemap, and astro-i18n were integrated, ensuring the website’s fast performance and its capability to cater to a diverse audience.',
      ),
    ),
    mediaBlock(demo, richText('Web site video demonstration.'), { frame: true }),
    sectionBlock(
      'UI Elements',
      'UI Enhancements for user engagement',
      richText(
        'Aiming to differentiate the website from its competitors and update its appearance, I implemented a series of components with subtle animations and microinteractions. These components are designed to enhance the navigation experience, presenting information in a different and relevant way for the user.',
        'The strategy seeks to attract and retain the user’s attention, encouraging them to delve deeper into the site and increase their stay. The implementation of these techniques not only updates the site’s aesthetics but also facilitates a more dynamic and personalized interaction with the content, strengthening the relationship between the site and its audience.',
      ),
    ),
    galleryBlock(items),
    sectionBlock(
      'Performance',
      'Enhancing speed with Astro JS',
      doc(
        para(
          txt(
            'As previously highlighted in the summary, a crucial aim of the website redesign was to boost its performance. To address this need, Astro JS was selected due to its ability to significantly speed up web development. This framework excels primarily because it prioritizes the delivery of pre-rendered HTML while keeping the JavaScript sent to clients to a minimum, which is key for faster loading times.',
          ),
        ),
        para(
          txt(
            'Additionally, features like Astro Compress and Astro Image were utilized to enhance site optimization. Astro Compress works by decreasing the sizes of files generated during the website build, such as JavaScript, CSS, and HTML, which contributes to reduced loading times. Meanwhile, Astro Image improves image handling by converting them to the WebP format and adjusting their sizes for different viewing devices. This strategy not only saves bandwidth but also ensures images are displayed optimally across all devices, thereby improving the site’s visual quality and maintaining a balance between aesthetic appeal and technical performance for a better user experience.',
          ),
        ),
        para(
          bold('You can check the results by yourself here:'),
          lineBreak(),
          link('PageSpeed Insights', 'https://pagespeed.web.dev/analysis/https-www-hotelbenetusser-net/m4m74xgoim?form_factor=mobile'),
          lineBreak(),
          link('GTmetrix', 'https://gtmetrix.com/reports/www.hotelbenetusser.net/4WcE88vd/'),
        ),
      ),
    ),
    mediaBlock(perf1, richText('Performance analysis performed by PageSpeed Insights.'), { frame: false, layout: 'half' }),
    mediaBlock(perf2, richText('Performance analysis performed by GTmetrix.'), { frame: false, layout: 'half' }),
    ...nextBlock(await ctx.workIdBySlug('rewind-hispano')),
  ]
}

const HOTEL_BENETUSSER: WorkDef = {
  slug: 'hotel-benetusser',
  title: 'Hotel Benetusser',
  author: AUTHOR,
  excerpt:
    'Freelance Project - Complete website renovation for Hotel Benetusser, modernizing their 20-year-old design with a focus on performance and bilingual support.',
  publishDate: '2023-01-11',
  accentColor: 'rgba(161, 198, 0, 1)',
  canonical: CANONICAL,
  heroImage: 'hotelBenetusserImg.png',
  postIndex: ['Overview', 'Context', 'UI Elements', 'Performance', 'Next Project'],
  buildLayout: (payload, ctx) =>
    hotelStyleLayout(payload, ctx, { rol: 'Frontend developer & Web Designer', duration: '2 months' }),
}

const SKOLA: WorkDef = {
  slug: 'skola-la-latina',
  title: 'Skola la Latina',
  author: AUTHOR,
  excerpt:
    'Freelance Project - Complete website overhaul for Skola la Latina, focusing on modern design and outstanding performance.',
  publishDate: '2023-01-09',
  accentColor: 'rgba(0, 180, 208, 1)',
  canonical: CANONICAL,
  heroImage: 'skolalalatinaImg.png',
  postIndex: ['Overview', 'Context', 'UI Elements', 'Performance', 'Next Project'],
  buildLayout: (payload, ctx) =>
    hotelStyleLayout(payload, ctx, { rol: 'Web Developer & Web Designer', duration: '1 month' }),
}

const SAN_ESTEBAN: WorkDef = {
  slug: 'san-esteban-de-gormaz-website',
  title: 'San Esteban De Gormaz Town Hall Website Renovation',
  author: AUTHOR,
  excerpt:
    'Ongoing Project - Leading the complete overhaul of the San Esteban De Gormaz Town Hall website, implementing a modern MERN stack solution with advanced features for improved digital services and administrative efficiency.',
  publishDate: '2024-01-11',
  accentColor: 'rgba(0, 123, 255, 1)',
  canonical: CANONICAL,
  heroImage: 'hotelBenetusserImg.png',
  postIndex: ['Overview', 'Technical Environment', 'Technical Stack', 'Next Project'],
  buildLayout: async (payload, ctx) => {
    const demo = await uploadMedia(payload, '/hotelBenetusser.mp4', 'Town hall website renovation demo')
    const arch = await uploadMedia(payload, 'rendimientoHB1.png', 'High-level architecture of the new town hall website')
    const perf = await uploadMedia(payload, 'rendimientoHB2.png', 'Performance improvements compared to the old website')

    const galleryClips: Array<[string, string, string]> = [
      ['benetusserClip1.mp4', 'PayloadCMS Content Management', 'Demonstration of the flexible block-based content management system.'],
      ['benetusserClip2.mp4', 'Sports Facility Reservation System', 'Walkthrough of the user-friendly booking process and automated access.'],
      ['benetusserClip4.mp4', 'Stripe Payment Integration', 'Seamless and secure payment process for facility bookings.'],
      ['benetusserClip3.mp4', 'Responsive Design', "Showcasing the website's adaptability across various devices."],
      ['benetusserClip5.mp4', 'Administrative Dashboard', 'Overview of the streamlined management interface for town hall staff.'],
    ]
    const items = []
    for (const [file, title, subtitle] of galleryClips) {
      items.push({ mediaFile: await uploadMedia(payload, file, title), title, subtitle })
    }

    return [
      infoBlock({
        rol: 'Front End Engineer',
        status: 'in progress',
        duration: '3+ months (ongoing)',
        overview: richText(
          'This project involves a comprehensive renovation of the San Esteban De Gormaz Town Hall website. The goal is to create a cutting-edge digital platform using NextJS and the MERN stack, incorporating PayloadCMS for flexible content management. A key feature is the development of an advanced sports facility reservation system with automated access and Stripe payment integration. The project aims to significantly enhance the town hall’s digital presence, streamline administrative processes, and provide residents with modern, user-friendly digital services.',
        ),
      }),
      sectionBlock(
        'Overview',
        'Modernizing Municipal Digital Services',
        richText(
          'The San Esteban De Gormaz Town Hall website renovation project represents a significant leap forward in municipal digital services. This comprehensive overhaul aims to transform the town’s online presence, offering residents a modern, efficient, and user-friendly platform for accessing information and services.',
          'Our approach combines cutting-edge web technologies with thoughtful design to create a website that not only looks great but also significantly improves functionality. Key features include a flexible content management system, an advanced sports facility reservation system, and integrated payment solutions. This project showcases the potential for small municipalities to leverage technology in enhancing community engagement and streamlining administrative processes.',
        ),
      ),
      mediaBlock(demo, richText('Website renovation demo showcasing new interface and functionality.'), { frame: true }),
      sectionBlock(
        'Technical Environment',
        'Cutting-Edge Tech Stack',
        doc(
          para(txt('The project utilizes a modern and robust tech stack to ensure high performance, scalability, and maintainability:')),
          list('ul', [
            [bold('Frontend'), txt(': NextJS 15RC with App Router, React 19RC, TypeScript, and TailwindCSS for a responsive and dynamic user interface.')],
            [bold('Backend'), txt(': MongoDB for flexible data storage, PayloadCMS 3.0 for content management, and Server Actions for efficient server-side operations.')],
            [bold('State Management'), txt(': Zustand for simplified global state management.')],
            [bold('UI Components'), txt(': Shadcn UI and Framer Motion for polished, animated user interfaces.')],
            [bold('Form Handling'), txt(': React Hook Form with ZOD for robust form validation.')],
            [bold('Additional Libraries'), txt(': Date FNS for date manipulation, Embla carousel for image galleries, and React Email for transactional emails.')],
            [bold('Integrations'), txt(': Stripe for payments, API Unifi Access for facility access control.')],
            [bold('Deployment'), txt(': Hetzner VPS running Coolify for streamlined deployment and management.')],
          ]),
          para(txt("This comprehensive stack allows us to create a high-performance, secure, and feature-rich platform tailored to the town hall’s specific needs.")),
        ),
      ),
      galleryBlock(items),
      sectionBlock(
        'Technical Stack',
        'Leveraging Modern Web Technologies',
        doc(
          para(txt("The choice of modern web technologies for this project was crucial in achieving our goals of improved performance, enhanced user experience, and easier maintenance. Here’s how key technologies contribute to the project’s success:")),
          list('ol', [
            [bold('NextJS and React'), txt(': Provides a fast, SEO-friendly foundation with server-side rendering capabilities, crucial for a public-facing municipal website.')],
            [bold('PayloadCMS'), txt(': Offers a flexible, block-based content management system that allows non-technical staff to easily update and manage website content.')],
            [bold('TypeScript'), txt(': Enhances code quality and maintainability, reducing potential bugs and making future updates easier.')],
            [bold('TailwindCSS'), txt(': Enables rapid UI development with a consistent design language across the site.')],
            [bold('MongoDB'), txt(': Provides a flexible database solution that can easily adapt to changing data requirements.')],
            [bold('Stripe Integration'), txt(': Ensures secure and reliable payment processing for facility bookings and other potential future paid services.')],
            [bold('API Unifi Access'), txt(': Enables automated access control for sports facilities, improving user experience and reducing administrative overhead.')],
          ]),
          para(txt("These technologies work together to create a platform that’s not only modern and efficient but also scalable and future-proof, setting a new standard for municipal websites.")),
        ),
      ),
      mediaBlock(arch, richText('High-level architecture of the new town hall website.'), { frame: false, layout: 'half' }),
      mediaBlock(perf, richText('Performance improvements compared to the old website.'), { frame: false, layout: 'half' }),
      ...nextBlock(await ctx.workIdBySlug('rewind-hispano')),
    ]
  },
}

const REWIND_TEAM: Array<{ role: string; members: string[] }> = [
  { role: 'Vfx supervisor.', members: ['Jose Luis Cardona Tudela'] },
  { role: 'Houdini supervisor', members: ['Hector Gallego'] },
  { role: 'Houdini artists', members: ['Ismael Martínez Martínez', 'Julen Elia Goñi'] },
  { role: 'Nuke comp.', members: ['Jose Luis Cardona Tudela', 'Gonzalo Arenas Norton', 'Mikel Casado Iriarte'] },
  { role: 'After effects comp.', members: ['Santiago Lagarde', 'Ariel González', 'Adrian Manciño', 'Iván Plaza', 'Adrián Botran'] },
  { role: '3D animation', members: ['Carlos Manuel Bea Masero', 'Iván Cabrera Cano', 'Ariel González Astudillo', 'Michael Alberto Abraham', 'Juan Carlos Garrido'] },
  { role: '3D modeling', members: ['Carlos Manuel Bea Masero', 'Iván Cabrera Cano', 'Juan Carlos Garrido', 'Santiago Morales'] },
  { role: '2D animation', members: ['Emerson Adrián Lugo'] },
  { role: 'Unreal engine', members: ['Santiago Morales', 'Carlos Juan Navarro', 'Javier Leoz'] },
  { role: 'Graphics design', members: ['Kevin Ernesto Vásquez', 'Álvaro Aracil Requeni', 'Pablo Vigil Escrivá', 'David Parada González'] },
  { role: 'Rigging', members: ['Salomón Kawas Zarzar'] },
  { role: 'Matchmove', members: ['Pedro Ginés Vidal', 'Santosh Dash', 'Debasis Sahu'] },
  { role: 'Rotoscoping and cleanup', members: ['Furkanul Muminz', 'Arundeep Palz', 'Ashiq Tamim', 'Ali Arif Shovo', 'Shiva Kumar Ravi', 'Abu Raihan Rasel', 'Anowar Hossain', 'Anil', 'Mahesh', 'Ramesh', 'Vijay', 'Ariyan Russel'] },
]

const REWIND_CARDS = [
  {
    ytId: 'TjkRhh3Gh1U',
    title: 'Rewind Hispano 2023',
    description: 'The 2023 edition featured a notable AI presence, represented by a small robot named R.O.B. in the video.',
    info: [
      { icon: 'calendarTime', text: 'Published on: 22-12-2023' },
      { icon: 'thumbUp', text: 'More than 1.1M of likes.' },
      { icon: 'eye', text: 'More than 9.3M of views on YouTube' },
      { icon: 'message-circle', text: 'Up to 88K of comments.' },
    ],
  },
  {
    ytId: 'IbAuuxBFwoo',
    title: 'Rewind Hispano 2022',
    description: 'The large number of events that took place in the Hispanic community during 2022 was the highlight of this edition.',
    info: [
      { icon: 'calendarTime', text: 'Published on: 28-12-2022' },
      { icon: 'thumbUp', text: 'More than 3.4M of likes.' },
      { icon: 'eye', text: 'More than 17M of views on YouTube' },
      { icon: 'message-circle', text: 'Up to 79K of comments.' },
    ],
  },
  {
    ytId: '_FMplFlIiOU',
    title: 'Rewind Hispano 2021',
    description: 'This edition is marked by the presence of great personalities in the video as well.',
    info: [
      { icon: 'calendarTime', text: 'Published on: 28-12-2021' },
      { icon: 'thumbUp', text: 'More than 4.4M of likes.' },
      { icon: 'eye', text: 'More than 23M of views on YouTube' },
      { icon: 'message-circle', text: 'Up to 119K of comments.' },
    ],
  },
  {
    ytId: 'h4NJCc4AQxw',
    title: 'Rewind Hispano 2020',
    description: 'This edition was marked by the improvement of the quality of the project both at production and post-production level.',
    info: [
      { icon: 'calendarTime', text: 'Published on: 26-12-2020' },
      { icon: 'thumbUp', text: 'More than 5.2M of likes.' },
      { icon: 'eye', text: 'More than 26M of views on YouTube' },
      { icon: 'message-circle', text: 'Up to 211K of comments.' },
    ],
  },
]

const REWIND: WorkDef = {
  slug: 'rewind-hispano',
  title: 'Rewind Hispano',
  author: AUTHOR,
  excerpt:
    'Side Project - I led the visual effects and IT infrastructure for "Rewind Hispano," coordinating an international team and enhancing remote collaboration with advanced server setups and resource management.',
  publishDate: '2023-01-12',
  accentColor: 'rgba(135, 0, 0, 1)',
  canonical: CANONICAL,
  heroImage: 'allRewindImages.png',
  postIndex: ['Overview', 'Context', '2023 Edition', 'It Infrastructure', 'Gallery'],
  buildLayout: async (payload, ctx) => {
    const robsketch = await uploadMedia(payload, '/robsketch.png', 'Initial sketches and concepts of ROB - By Carlos Bea')
    const schema = await uploadMedia(payload, '/schema.png', 'Teams organizational chart')
    const bd2 = await uploadMedia(payload, '/Breackdown2.mp4', 'Original studio shot')
    const bd1 = await uploadMedia(payload, '/Breackdown1.mp4', 'Final shot, breakdown by Jose Luis Cardona')
    const bd4 = await uploadMedia(payload, '/Breackdown4.mp4', 'Initial colored animation')
    const bd3 = await uploadMedia(payload, '/Breackdown3.mp4', 'Final animation with background')
    const bd6 = await uploadMedia(payload, '/Breackdown6.mp4', 'Initial shot with background and brands')
    const bd5 = await uploadMedia(payload, '/Breackdown5.mp4', 'Shot with background and brands removed, ready for composition')
    const network = await uploadMedia(payload, '/network.png', 'Simplified network structure diagram')
    const server1 = await uploadMedia(payload, '/server1.png', 'Synology server')
    const server2 = await uploadMedia(payload, '/server2.png', 'TrueNas Scale server')
    const folder = await uploadMedia(payload, '/folder.png', 'Shared folder')
    const folder2 = await uploadMedia(payload, '/folder2.png', 'Shared folder inside the VFX department')

    const galleryClips: Array<[string, string, string]> = [
      ['clip0.mp4', 'The best and longest intro.', 'For this edition, we opted to provide a general context through the video, making the introduction essential as it sets the stage for the rest of the content.'],
      ['clip1.mp4', 'Combination of different styles', 'We decided to try something different and included 2d animation.'],
      ['robgifOP.mp4', 'Say hello to R.O.B !', 'Created from scratch by us, this AI was the common thread of the whole video.'],
      ['clip2.mp4', "The 'Optic Fiber'", "The 'Fiber optic' are depicted as a crucial concept in the virtual world envisioned by scriptwriters, portrayed as a vast glass tube surrounded by pixelated elements."],
      ['clip3.mp4', 'Trinity explosion recreation.', "It is undeniable the great impact that Oppenheimer's movie had in 2023, so we wanted to pay tribute to it by including a complete scene recreating the Trinity explosion and proving that it can be done with vfx ;)."],
    ]
    const items = []
    for (const [file, title, subtitle] of galleryClips) {
      items.push({ mediaFile: await uploadMedia(payload, file, title), title, subtitle })
    }

    return [
      infoBlock({
        rol: 'Head of IT & VFX Supervisor',
        title: '2023 Team',
        status: 'done',
        duration: '4 months',
        team: buildTeam(REWIND_TEAM),
        overview: richText(
          'The "Rewind Hispano" is a short film created by Alec Hernández that celebrates the most significant moments, trends, and figures of the year within the Spanish-speaking digital creators’ community. As the VFX Supervisor and IT manager of the "Rewind Hispano" from 2020 to 2023, I had the privilege of leading the visual effects production and server infrastructure for this annual project.',
          'In the most recent edition, I faced the challenge of coordinating and supervising an international team of over 40 VFX specialists spread across more than eight countries, including Spain, Hungary, Mexico, Venezuela, El Salvador, Argentina, Bangladesh, India... This challenge required not only managing a diverse and geographically dispersed team but also implementing technical solutions to ensure effective and efficient remote collaboration.',
          'My responsibilities were extensive and included team organization, resource allocation, post-production budget management, and negotiating with suppliers. In addition to these organizational tasks, I also took on the role of IT Manager, setting up the necessary server infrastructure to facilitate remote work. This goes from configuring servers with decentralized redundancy to implementing systems for secure and efficient large-scale file transfers, ensuring seamless operations across different geographic zones.',
        ),
      }),

      // --- Context ---
      sectionBlock(
        'Context',
        'The event that unite us',
        richText(
          'The "Rewind Hispano" is a community project created by Alec Hernández and produced by DHC FIlms, that wants to bring together the Spanish-speaking content creator community to celebrate the year\'s highlights. Inspired by the concept of YouTube Rewind, this annual video features the trends, events, and personalities that set the agenda on the Spanish-speaking internet, but with a specific focus on the richness and diversity of the digital culture in Spanish. Unlike its global counterpart produced by YouTube, the Rewind Hispano is an initiative created by and for the Hispanic community, allowing for a more authentic and closer representation of its interests and achievements.',
        ),
      ),
      cardsBlock(REWIND_CARDS),
      rtBlock(
        richText(
          'The project aims not only to celebrate the successes and viral moments of the year but also to encourage collaboration among creators from various countries, creating a space for union and mutual recognition. It includes everything from sketches and references to popular memes to tributes to influential figures in the digital community who, through innovative visual effects and creative narratives, create a time capsule of the Hispanic digital culture of the year.',
        ),
      ),

      // --- 2023 Edition ---
      sectionBlock(
        '2023 Edition',
        'More than 260 shots in less than 80 days',
        richText(
          'For the 2023 edition, Alec and the team of scriptwriters set out to innovate by transforming the previous format, based on small sketches linked by transitions, into a more cohesive narrative structure with logical connections between all the scenes. To achieve this, we introduced a central character: R.O.B., an animated robot that embodies Artificial Intelligence, in charge of guiding the narration of the video.',
        ),
      ),
      mediaBlock(robsketch, doc(para(txt('Initial sketches and concepts of ROB - '), italic('By Carlos Bea'), txt('.'))), { frame: true }),
      rtBlock(
        doc(
          para(
            txt('This renewed approach brought several post-production challenges. Incorporating an animated robot into most scenes, along with the extensive visual effects (VFX) work characteristic of this project, significantly increased the number of shots requiring post-production. '),
            bold('The post-production process began on October 1, 2023, providing us with 79 days to deliver the final product by December 18.'),
            txt(' During this time, post-production proceeded concurrently with the filming of new sequences, underscoring the necessity for efficient coordination across all teams.'),
          ),
          para(
            txt('To ensure effective collaboration, we divided post-production into three primary groups, each consisting of specialized teams. These teams were given clear objectives, guidelines on the expected final outcome, and delivery deadlines. Within each group, members selected tasks in consultation with their colleagues, fostering a supportive work environment and ensuring the quality of the final product. Given the tight deadlines, we had to ensure accuracy on the first attempt, as there was no room for redoing parts or entire scenes.'),
          ),
        ),
      ),
      mediaBlock(schema, richText('Teams organizational chart.'), { frame: true }),
      rtBlock(
        doc(
          para(
            txt('For example, for the initial scene running from minute '),
            link('2:11', 'https://youtu.be/TjkRhh3Gh1U?t=132'),
            txt(' to '),
            link('3:31', 'https://youtu.be/TjkRhh3Gh1U?t=212'),
            txt(', we began pre-editing as soon as the shots were received from the filming team on set. Alec then reviewed and refined this edit to achieve the final version we continued to work on. Subsequently, we convened the necessary teams for this sequence, which included specialists in 3D animation, 2D animation, composition, Houdini, and motion graphics.'),
          ),
        ),
      ),
      mediaBlock(bd2, richText('Original studio shot.'), { frame: false, layout: 'half' }),
      mediaBlock(bd1, richText('Final shot, breakdown by Jose Luis Cardona.'), { frame: false, layout: 'half' }),
      mediaBlock(bd4, richText('Initial colored animation.'), { frame: false, layout: 'half' }),
      mediaBlock(bd3, richText('Final animation with background.'), { frame: false, layout: 'half' }),
      rtBlock(
        richText(
          'At this meeting, the specific tasks of each team, the desired end result, the deadlines and the resources needed to carry them out were defined. Specifically, this scene required 3D tracking of the environment for the precise integration of the robot, as well as the removal of brands, logos and backgrounds. As these tasks are purely mechanical and do not directly enhance the final aesthetics, we outsourced them to specialized vendors, one vendor for 3D tracking, and another vendor for logo removal and background removal.',
        ),
      ),
      mediaBlock(bd6, richText('Initial shot with background and brands.'), { frame: false, layout: 'half' }),
      mediaBlock(bd5, richText('Shot with background and brands removed, ready for composition.'), { frame: false, layout: 'half' }),
      rtBlock(
        doc(
          para(
            txt('This way of organization and work was repeated with as many scenes as possible, thanks to this we were able to quickly scale and parallelize the post-production process, which ended up with '),
            bold('more than 40 people working at the same time in small parts of the project'),
            txt(', which allowed us to meet the deadline without any team member ending up overloaded with work.'),
          ),
        ),
      ),

      // --- IT Infrastructure ---
      sectionBlock(
        'It infrastructure',
        'The Network Behind the Project',
        doc(
          para(
            txt('This parallel workflow allowed us to progress at a great pace, meeting our deadline. However, '),
            bold('coordinating 40 people working remotely from around the globe, handling video files of 6.7GB per minute… posed significant challenges in terms of infrastructure'),
            txt('. Critical questions arose: How do we securely store the files? What’s the best way to send them globally? How do we manage access permissions?.'),
          ),
        ),
      ),
      rtBlock(richText('I was tasked with designing and implementing a network infrastructure that could address these issues and adapt to the project’s workflow. The final design was as follows:')),
      mediaBlock(network, richText('Simplified network structure diagram.'), { frame: true }),
      rtBlock(richText('From a hardware standpoint, the network comprises two servers located in different places: a Synology DS1621+ and another server I assembled myself, running TrueNAS Scale. Opting for two distinct physical locations aimed to maximize protection against incidents like fires, collapses, or thefts. Each server features a set of disks in RAID 5, with 1TB read and write caches, and each is backed by an EATON 5SC 1500I UPS system.')),
      mediaBlock(server1, richText('Synology server.'), { frame: false, layout: 'half' }),
      mediaBlock(server2, richText('TrueNas Scale server.'), { frame: false, layout: 'half', delay: 0.35 }),
      rtBlock(
        doc(
          para(
            txt('The designed workflow goes as follows: The filming team uploads the video files to the TrueNAS server, either physically via SMB or remotely through Filebrowser. Then, these files automatically sync with the Synology server via Syncthing. Once the files are synchronized on the Synology server, any user needing to access the files will do so through this server, utilizing Synology Drive since this app simplifies file syncing with its desktop application. All files uploaded by the filming team are located in a shared folder with the following structure:'),
          ),
          para(txt('-Raw Footage'), lineBreak(), txt('-VFX'), lineBreak(), txt('-Sound'), lineBreak(), txt('-Previews')),
          para(txt('Post-production team members can view the entire shared folder but only have editing permissions within their department’s folder. In their own folder, they have complete control, but in their colleagues’ folders, they can only view, add, copy, and download files, not edit or delete them.')),
        ),
      ),
      mediaBlock(folder, richText('Shared folder.'), { frame: false, layout: 'half' }),
      mediaBlock(folder2, richText('Shared folder inside the VFX department.'), { frame: false, layout: 'half', delay: 0.35 }),
      rtBlock(
        richText(
          'Each user’s personal folder will sync bidirectionally with their desktop through Synology Drive, allowing any changes to be automatically uploaded to the server and vice versa. This synchronization eliminates the need for constantly sending links from platforms like Google Drive or WeTransfer, facilitating collaboration.',
          'Moreover, this shared folder on the Synology server syncs bidirectionally with the TrueNAS server, thus ensuring off-site redundancy. As an additional security measure, both servers generate incremental snapshots every 30 minutes, retaining them for a week to allow for file recovery in case of corruption or accidental deletion.',
          'The infrastructure is complemented with solutions for direct and fast file access, crucial for editors. For Alec, who does the final cut, the solution is straightforward thanks to a 10Gbe connection with the Synology server in his office, allowing him to use the server as another hard drive on his system. For the editor doing the preliminary cut, I implemented a Windows 10 virtual machine on the TrueNAS Scale server, enabling remote access to the shared folder via Parsec for immediate editing. The resulting Premiere files automatically sync with the Synology server, facilitating access for the entire team.',
        ),
      ),

      // --- Gallery ---
      sectionBlock(
        'Gallery',
        'Check out the results of this latest edition',
        doc(
          para(
            txt('Among more than 260 shots in total it is difficult to decide, but here you can find a small summary of the highlights of the whole short film. If you want to know more information about this short film you can also visit the making of by clicking '),
            mkLink('https://www.youtube.com/watch?v=mqtqamTtabg', [boldItalic('here')]),
            txt('.'),
          ),
        ),
      ),
      galleryBlock(items),
      statsBlock([
        { title: 'CGI Scenes in Total', amount: '260' },
        { title: 'People Involved', amount: '40' },
        { title: 'Nationalities Involved', amount: '8' },
        { title: 'Million Views in Total', amount: '75' },
      ]),
      ...nextBlock(await ctx.workIdBySlug('hotel-benetusser')),
    ]
  },
}

const WORKS: WorkDef[] = [HOTEL_BENETUSSER, SKOLA, SAN_ESTEBAN, REWIND]

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------
async function migrate() {
  const payload = await getPayload({ config })

  const workIdBySlug = async (slug: string): Promise<string | null> => {
    const res = await payload.find({ collection: 'works', where: { slug: { equals: slug } }, limit: 1 })
    return res.docs[0]?.id ?? null
  }
  const ctx: Ctx = { workIdBySlug }

  for (const def of WORKS) {
    console.log(`\nMigrating: ${def.title}`)
    const imageId = await uploadMedia(payload, def.heroImage, `${def.title} hero image`)
    const layout = await def.buildLayout(payload, ctx)

    const data = {
      title: def.title,
      author: def.author,
      excerpt: def.excerpt,
      publishDate: new Date(def.publishDate).toISOString(),
      accentColor: def.accentColor,
      canonical: def.canonical,
      slug: def.slug,
      image: imageId,
      postIndex: def.postIndex.map((label, i) => ({ label, anchor: `#section-${i + 1}` })),
      layout,
    }

    const existingId = await workIdBySlug(def.slug)
    if (existingId) {
      await payload.update({ collection: 'works', id: existingId, data })
      console.log(`  ✓ updated existing work (${def.slug})`)
    } else {
      await payload.create({ collection: 'works', data })
      console.log(`  ✓ created work (${def.slug})`)
    }
  }

  console.log('\nMigration completed.')
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
