
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');
const htmlFilePath = path.join(distDir, 'index.html');

// 1. Read the original index.html
let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

// 2. Find and inline CSS
const cssLinkRegex = /<link rel="stylesheet"[^>]+href="(\.\/assets\/[^"\s]+)">/g;
let match;
while ((match = cssLinkRegex.exec(htmlContent)) !== null) {
    const cssRelativePath = match[1];
    const cssAbsolutePath = path.join(distDir, cssRelativePath);
    const cssContent = fs.readFileSync(cssAbsolutePath, 'utf-8');
    htmlContent = htmlContent.replace(match[0], `<style>${cssContent}</style>`);
}

// 3. Find and inline JS
const scriptTagRegex = /<script[^>]+src="(\.\/assets\/[^"\s]+)"><\/script>/g;
while ((match = scriptTagRegex.exec(htmlContent)) !== null) {
    const jsRelativePath = match[1];
    const jsAbsolutePath = path.join(distDir, jsRelativePath);
    const jsContent = fs.readFileSync(jsAbsolutePath, 'utf-8');
    // Remove the original script tag and append the inlined script at the end of body
    htmlContent = htmlContent.replace(match[0], '');
    htmlContent = htmlContent.replace('</body>', `<script>${jsContent}</script></body>`);
}

// 4. Write the new bundled file
const bundlePath = path.join(distDir, 'index_bundle.html');
fs.writeFileSync(bundlePath, htmlContent, 'utf-8');

console.log(`Successfully created bundle: ${bundlePath}`);
