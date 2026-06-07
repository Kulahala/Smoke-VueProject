const fs = require('fs');
const path = require('path');

// Dynamically require sharp so that it's only needed when actually running the script
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Error: "sharp" package is required to run this script.');
  console.error('Please run "npm install sharp" first.');
  process.exit(1);
}

const projectRoot = path.join(__dirname, '..');
const targetDir = path.join(projectRoot, 'public/电子烟');
const backupDir = path.join(projectRoot, 'original_images_backup');

async function run() {
  if (!fs.existsSync(targetDir)) {
    console.log('Target directory public/电子烟/ does not exist.');
    return;
  }

  // Find all png, jpg, jpeg files in public/电子烟/
  const files = fs.readdirSync(targetDir);
  const imagesToProcess = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(targetDir, file);
    return fs.statSync(filePath).isFile() && ['.png', '.jpg', '.jpeg'].includes(ext);
  });

  if (imagesToProcess.length === 0) {
    console.log('No new PNG/JPG/JPEG images found to convert.');
    return;
  }

  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log(`Created backup directory: ${backupDir}`);
  }

  console.log(`Found ${imagesToProcess.length} images to convert...`);

  // Map to store converted file names for reference replacement
  const replacements = [];

  for (const file of imagesToProcess) {
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const sourcePath = path.join(targetDir, file);
    const destWebpPath = path.join(targetDir, `${baseName}.webp`);
    const backupPath = path.join(backupDir, file);

    try {
      // 1. Convert to WebP
      await sharp(sourcePath)
        .webp({ quality: 85 })
        .toFile(destWebpPath);
      console.log(`Converted: ${file} -> ${baseName}.webp`);

      // 2. Move original to backup directory (copy then delete to ensure safety across filesystems)
      fs.copyFileSync(sourcePath, backupPath);
      fs.unlinkSync(sourcePath);
      console.log(`Backed up original: ${file} -> original_images_backup/`);

      replacements.push({
        oldName: file,
        newName: `${baseName}.webp`
      });
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }

  if (replacements.length > 0) {
    // Replace references in codebase
    replaceReferences(replacements);
  }
}

function replaceReferences(replacements) {
  const replaceInFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const r of replacements) {
      // Escape special regex characters in the file name
      const escapedOldName = r.oldName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\/电子烟\\/${escapedOldName}`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `/电子烟/${r.newName}`);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated references in: ${filePath}`);
    }
  };

  const scanDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) return;
    const list = fs.readdirSync(dirPath);
    for (const item of list) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath).toLowerCase();
        if (['.json', '.vue', '.js', '.css', '.html'].includes(ext)) {
          replaceInFile(fullPath);
        }
      }
    }
  };

  console.log('Updating references in code files...');
  scanDirectory(path.join(projectRoot, 'src/data'));
  scanDirectory(path.join(projectRoot, 'src/views'));
  scanDirectory(path.join(projectRoot, 'src/components'));
  scanDirectory(path.join(projectRoot, 'src/store'));
  replaceInFile(path.join(projectRoot, 'src/App.vue'));
  replaceInFile(path.join(projectRoot, 'index.html'));
}

run().then(() => {
  console.log('Automated image compression process complete.');
}).catch(err => {
  console.error('Process failed:', err);
  process.exit(1);
});
