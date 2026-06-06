const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

function ensureDocsDir() {
    if (!fs.existsSync(DOCS_DIR)) {
        fs.mkdirSync(DOCS_DIR, { recursive: true });
    }
}

function parseDependencies() {
    const files = fs.readdirSync(ROOT_DIR);
    const nodes = [];
    const edges = [];
    const regexes = {
        fetch: /fetch\(['"`](.*?)['"`]\)/g,
        script: /<script[^>]+src=['"]([^'"]+)['"]/g,
        link: /<link[^>]+href=['"]([^'"]+)['"]/g,
        import: /import\s+.*?from\s+['"](.*?)['"]/g
    };

    files.forEach(file => {
        const filePath = path.join(ROOT_DIR, file);
        if (fs.statSync(filePath).isFile()) {
            if (file === 'README.md' || file.startsWith('.')) return;

            nodes.push(file);
            const content = fs.readFileSync(filePath, 'utf-8');

            Object.keys(regexes).forEach(type => {
                let match;
                while ((match = regexes[type].exec(content)) !== null) {
                    let target = match[1];
                    if (target.startsWith('./')) target = target.slice(2);
                    edges.push({ source: file, target, type });
                }
            });
        }
    });

    return { nodes, edges };
}

function generateArchitectureDiagram() {
    const { nodes, edges } = parseDependencies();

    let diagram = `\`\`\`mermaid
graph TD
    Client[Browser / Client]

`;

    if (nodes.includes('index.html')) {
        diagram += `    Client --> index.html\n`;
    }

    nodes.forEach(node => {
        const safeNode = node.replace(/[^a-zA-Z0-9]/g, '_');
        diagram += `    ${safeNode}[${node}]\n`;
    });

    diagram += '\n';

    edges.forEach(edge => {
        const safeSource = edge.source.replace(/[^a-zA-Z0-9]/g, '_');
        const safeTarget = edge.target.replace(/[^a-zA-Z0-9]/g, '_');
        let label = '';
        if (edge.type === 'fetch') label = '|fetch API|';
        if (edge.type === 'script') label = '|script src|';
        if (edge.type === 'link') label = '|CSS link|';
        if (edge.type === 'import') label = '|ES6 import|';

        diagram += `    ${safeSource} -->${label} ${safeTarget}\n`;
    });

    diagram += `
    classDef file fill:#f9f,stroke:#333,stroke-width:2px;
    class ${nodes.map(n => n.replace(/[^a-zA-Z0-9]/g, '_')).join(',')} file;
\`\`\`
`;
    return diagram;
}

function generate() {
    console.log('Generating dynamic diagrams based on repository contents...');
    ensureDocsDir();

    const archDiagram = generateArchitectureDiagram();

    fs.writeFileSync(path.join(DOCS_DIR, 'architecture.md'), `# Dynamic System Architecture\n\n${archDiagram}`);
    console.log('Dynamic architecture diagram generated successfully in /docs');
}

generate();
