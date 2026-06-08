const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const targetDir = path.join(projectRoot, 'public/电子烟');
const productsDir = path.join(projectRoot, 'src/data/products');
const categoriesFile = path.join(projectRoot, 'src/data/categories.json');
const settingsFile = path.join(projectRoot, 'src/data/settings.json');
const appVueFile = path.join(projectRoot, 'src/App.vue');
const viewsDir = path.join(projectRoot, 'src/views');
const componentsDir = path.join(projectRoot, 'src/components');
const indexHtmlFile = path.join(projectRoot, 'index.html');

// Read all product JSONs to find image mappings
const productFiles = fs.readdirSync(productsDir).filter(f => f.endsWith('.json'));

const fileMap = {}; // mapping from old full relative path to new full relative path

// 1. Process product images
for (const prodFile of productFiles) {
  const filePath = path.join(productsDir, prodFile);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const id = data.id;
  
  if (data.images && Array.isArray(data.images)) {
    data.images.forEach((img, index) => {
      if (img.startsWith('/电子烟/') && !img.includes('/placeholders/')) {
        const ext = path.extname(img);
        const newName = `/电子烟/Product${id}_${index + 1}${ext}`;
        fileMap[img] = newName;
      }
    });
  } else if (data.image) {
    const img = data.image;
    if (img.startsWith('/电子烟/') && !img.includes('/placeholders/')) {
      const ext = path.extname(img);
      const newName = `/电子烟/Product${id}_1${ext}`;
      fileMap[img] = newName;
    }
  }
}

// Ensure favicon components aren't renamed dynamically
delete fileMap['/电子烟/smoke.webp'];
delete fileMap['/电子烟/smoke-light.webp'];

console.log('Images renaming mapping:');
console.log(fileMap);

// 2. Perform file renames physically in public/电子烟
Object.keys(fileMap).forEach(oldPath => {
  const newPath = fileMap[oldPath];
  const oldLocalPath = path.join(projectRoot, 'public', oldPath);
  const newLocalPath = path.join(projectRoot, 'public', newPath);
  
  if (fs.existsSync(oldLocalPath)) {
    fs.renameSync(oldLocalPath, newLocalPath);
    console.log(`Renamed file: ${oldPath} -> ${newPath}`);
  } else {
    console.warn(`File not found to rename: ${oldLocalPath}`);
  }
});

// 3. Replace all path references in JSON, HTML, VUE, JS files
const filesToUpdate = [];

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
        filesToUpdate.push(fullPath);
      }
    }
  }
};

scanDirectory(productsDir);
scanDirectory(viewsDir);
scanDirectory(componentsDir);
if (fs.existsSync(categoriesFile)) filesToUpdate.push(categoriesFile);
if (fs.existsSync(settingsFile)) filesToUpdate.push(settingsFile);
if (fs.existsSync(appVueFile)) filesToUpdate.push(appVueFile);
if (fs.existsSync(indexHtmlFile)) filesToUpdate.push(indexHtmlFile);

filesToUpdate.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  Object.keys(fileMap).forEach(oldPath => {
    const newPath = fileMap[oldPath];
    if (content.includes(oldPath)) {
      content = content.split(oldPath).join(newPath);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated paths in: ${filePath}`);
  }
});

console.log('All image assets and code references successfully renamed!');
