/**
 * Static Site Generator
 * =====================
 * Simple build script that generates static HTML from templates and content.
 * 
 * Features:
 * - Markdown to HTML conversion
 * - Template partials (header, footer, nav)
 * - Static asset copying
 * - Metadata injection
 */

const fs = require('fs')
const path = require('path')
const { marked } = require('marked')

// Configuration
const CONFIG = {
  srcDir: path.join(__dirname, '..', 'src'),
  distDir: path.join(__dirname, '..', 'dist'),
  templatesDir: path.join(__dirname, '..', 'src', 'templates'),
  contentDir: path.join(__dirname, '..', 'src', 'content'),
  assetsDir: path.join(__dirname, '..', 'src', 'assets'),
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * Copy directory recursively
 */
function copyDir(src, dest) {
  ensureDir(dest)
  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

/**
 * Load template partial
 */
function loadPartial(name) {
  const partialPath = path.join(CONFIG.templatesDir, 'partials', `${name}.html`)
  if (fs.existsSync(partialPath)) {
    return fs.readFileSync(partialPath, 'utf-8')
  }
  return ''
}

/**
 * Parse frontmatter from content
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  
  if (!match) {
    return { metadata: {}, content }
  }

  const frontmatter = match[1]
  const body = match[2]
  const metadata = {}

  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length) {
      metadata[key.trim()] = valueParts.join(':').trim()
    }
  })

  return { metadata, content: body }
}

/**
 * Apply template with variables
 */
function applyTemplate(template, variables) {
  let result = template

  // Replace variables
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value)
  }

  // Replace partials
  result = result.replace(/{{\s*partial:\s*(\w+)\s*}}/g, (match, partialName) => {
    return loadPartial(partialName)
  })

  return result
}

/**
 * Build a single page
 */
function buildPage(contentFile, templateName = 'default') {
  const contentPath = path.join(CONFIG.contentDir, contentFile)
  const templatePath = path.join(CONFIG.templatesDir, `${templateName}.html`)

  if (!fs.existsSync(contentPath)) {
    console.error(`Content file not found: ${contentFile}`)
    return
  }

  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templateName}`)
    return
  }

  // Read and parse content
  const rawContent = fs.readFileSync(contentPath, 'utf-8')
  const { metadata, content } = parseFrontmatter(rawContent)

  // Convert Markdown to HTML if needed
  const isMarkdown = contentFile.endsWith('.md')
  const htmlContent = isMarkdown ? marked(content) : content

  // Load template
  const template = fs.readFileSync(templatePath, 'utf-8')

  // Apply template
  const html = applyTemplate(template, {
    title: metadata.title || 'Untitled',
    description: metadata.description || '',
    content: htmlContent,
    ...metadata,
  })

  // Write output
  const outputFile = contentFile.replace(/\.(md|html)$/, '.html')
  const outputPath = path.join(CONFIG.distDir, outputFile)
  fs.writeFileSync(outputPath, html)

  console.log(`✓ Built: ${outputFile}`)
}

/**
 * Main build function
 */
function build() {
  console.log('🔨 Building static site...\n')

  // Clean and create dist directory
  if (fs.existsSync(CONFIG.distDir)) {
    fs.rmSync(CONFIG.distDir, { recursive: true })
  }
  ensureDir(CONFIG.distDir)

  // Copy assets
  if (fs.existsSync(CONFIG.assetsDir)) {
    copyDir(CONFIG.assetsDir, path.join(CONFIG.distDir, 'assets'))
    console.log('✓ Copied assets\n')
  }

  // Build pages
  const contentFiles = fs.readdirSync(CONFIG.contentDir)
  for (const file of contentFiles) {
    if (file.endsWith('.md') || file.endsWith('.html')) {
      buildPage(file)
    }
  }

  console.log('\n✅ Build complete!')
  console.log(`📁 Output: ${CONFIG.distDir}`)
}

// Run build
build()
