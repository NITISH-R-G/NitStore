const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const IGNORE_DIRS = ['.git', 'node_modules', '.github'];

function getDirectoryTree(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    let tree = '';

    files.forEach((file, index) => {
        if (IGNORE_DIRS.includes(file)) return;

        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const isLast = index === files.length - 1;

        tree += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;

        if (stats.isDirectory()) {
            tree += getDirectoryTree(filePath, prefix + (isLast ? '    ' : '│   '));
        }
    });

    return tree;
}

function analyzeDependencies() {
    let deps = {};
    const packageJsonPath = path.join(ROOT_DIR, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        deps = { ...pkg.dependencies, ...pkg.devDependencies };
    }
    return deps;
}

function analyzeTechnologies(treeStr) {
    const techs = [];
    if (treeStr.includes('index.html')) techs.push('HTML5');
    if (treeStr.includes('style.css')) techs.push('CSS3');
    if (treeStr.includes('script.js')) techs.push('Vanilla JavaScript');
    if (treeStr.includes('products.json')) techs.push('JSON Data Storage');
    if (treeStr.includes('.github')) techs.push('GitHub Actions');

    return techs;
}

function analyze() {
    console.log('Starting repository analysis...');

    const tree = getDirectoryTree(ROOT_DIR);
    const deps = analyzeDependencies();
    const techs = analyzeTechnologies(tree);

    const analysis = {
        timestamp: new Date().toISOString(),
        structure: tree,
        dependencies: deps,
        technologies: techs,
        entry_points: ['index.html']
    };

    fs.writeFileSync(
        path.join(ROOT_DIR, 'scripts', 'analysis.json'),
        JSON.stringify(analysis, null, 2)
    );

    console.log('Analysis complete. Results saved to scripts/analysis.json');
}

analyze();
