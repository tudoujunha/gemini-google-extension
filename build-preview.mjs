import archiver from 'archiver'
import autoprefixer from 'autoprefixer'
import * as dotenv from 'dotenv'
import esbuild from 'esbuild'
import postcssPlugin from 'esbuild-style-plugin'
import fs from 'fs-extra'
import process from 'node:process'
import tailwindcss from 'tailwindcss'
dotenv.config()

const outdir = 'preview'

async function deleteOldDir() {
  await fs.remove(outdir)
}

async function runEsbuild() {
  await esbuild.build({
    entryPoints: [
      'src/content-script/index.tsx',
      'src/background/index.ts',
      'src/options/index.tsx',
    ],
    bundle: true,
    outdir: outdir,
    treeShaking: true,
    minify: false,
    sourcemap: true,
    legalComments: 'none',
    define: {
      'process.env.NODE_ENV': '"development"',
      'process.env.AXIOM_TOKEN': JSON.stringify(process.env.AXIOM_TOKEN || 'UNDEFINED'),
    },
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsx: 'automatic',
    loader: {
      '.png': 'dataurl',
    },
    plugins: [
      postcssPlugin({
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      }),
    ],
  })
}

async function zipFolder(dir) {
  const output = fs.createWriteStream(`${dir}.zip`)
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })
  archive.pipe(output)
  archive.directory(dir, false)
  await archive.finalize()
}

async function copyFiles(entryPoints, targetDir) {
  await fs.ensureDir(targetDir)
  await Promise.all(
    entryPoints.map(async (entryPoint) => {
      await fs.copy(entryPoint.src, `${targetDir}/${entryPoint.dst}`)
    }),
  )
}

async function build() {
  await deleteOldDir()
  await runEsbuild()

  const commonFiles = [
    { src: 'preview/content-script/index.js', dst: 'content-script.js' },
    { src: 'preview/content-script/index.js.map', dst: 'content-script.js.map' },
    { src: 'preview/content-script/index.css', dst: 'content-script.css' },
    { src: 'preview/background/index.js', dst: 'background.js' },
    { src: 'preview/background/index.js.map', dst: 'background.js.map' },
    { src: 'preview/options/index.js', dst: 'options.js' },
    { src: 'preview/options/index.js.map', dst: 'options.js.map' },
    { src: 'preview/options/index.css', dst: 'options.css' },
    { src: 'src/options/index.html', dst: 'options.html' },
    { src: 'src/logo.png', dst: 'logo.png' },
    { src: 'src/_locales', dst: '_locales' },
  ]



  // chromium
  await copyFiles(
    [...commonFiles, { src: 'src/manifest.json', dst: 'manifest.json' }],
    `./${outdir}/chromium`,
  )
  commonFiles.forEach(file => {
    if (file.dst.endsWith('.js')) {
      const jsFilePath = `./${outdir}/chromium/${file.dst}`;
      const mapFileName = file.dst.replace(/\.js$/, '.js.map');
      const content = fs.readFileSync(jsFilePath, 'utf8');
      const updatedContent = content.replace(/sourceMappingURL=.+\.map/, `sourceMappingURL=${mapFileName}`);
      fs.writeFileSync(jsFilePath, updatedContent, 'utf8');
    }
  });
  
  // await zipFolder(`./${outdir}/chromium`)

  // firefox
  // await copyFiles(
  //   [...commonFiles, { src: 'src/manifest.v2.json', dst: 'manifest.json' }],
  //   `./${outdir}/firefox`,
  // )

  // await zipFolder(`./${outdir}/firefox`)

  console.log('Build success.')
}

build()
