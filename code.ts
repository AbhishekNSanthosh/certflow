// CertFlow - Certificate Generator Plugin
// Main plugin code with smart auto-detection

let selectedTemplateNode: SceneNode | null = null;

// Show the plugin UI
figma.showUI(__html__, { width: 520, height: 750 });

// Handle messages from UI
figma.ui.onmessage = async (msg: any) => {
    try {
        if (msg.type === 'select-template') {
            await handleTemplateSelection();
        }

        if (msg.type === 'fetch-url') {
            await fetchDataFromURL(msg.url);
        }

        if (msg.type === 'generate-certificates') {
            await generateCertificates(msg);
        }
    } catch (error: any) {
        figma.ui.postMessage({
            type: 'error',
            message: error?.message || 'An unexpected error occurred'
        });
    }
};

/**
 * Handle template selection and auto-detect text layers
 */
async function handleTemplateSelection() {
    const selection = figma.currentPage.selection;

    if (selection.length === 0) {
        figma.ui.postMessage({
            type: 'error',
            message: 'Please select a frame or component to use as template'
        });
        return;
    }

    if (selection.length > 1) {
        figma.ui.postMessage({
            type: 'error',
            message: 'Please select only one frame or component'
        });
        return;
    }

    const node = selection[0];

    // Validate that it's a frame or component
    if (node.type !== 'FRAME' && node.type !== 'COMPONENT' && node.type !== 'INSTANCE') {
        figma.ui.postMessage({
            type: 'error',
            message: 'Please select a Frame, Component, or Instance'
        });
        return;
    }

    selectedTemplateNode = node;

    // Auto-detect all text layers in the template
    const textLayers = findAllTextLayers(node);

    figma.ui.postMessage({
        type: 'template-selected',
        nodeId: node.id,
        nodeName: node.name,
        textLayers: textLayers
    });
}

/**
 * Recursively find all text layer names in a node
 */
function findAllTextLayers(node: SceneNode): string[] {
    const textLayers: string[] = [];

    if (node.type === 'TEXT') {
        // Extract text layer name (clean it up)
        const layerName = node.name.toLowerCase().trim();
        if (layerName && !textLayers.includes(layerName)) {
            textLayers.push(layerName);
        }
    }

    // Process children if the node has them
    if ('children' in node) {
        for (const child of node.children) {
            const childLayers = findAllTextLayers(child);
            childLayers.forEach(layer => {
                if (!textLayers.includes(layer)) {
                    textLayers.push(layer);
                }
            });
        }
    }

    return textLayers;
}

/**
 * Fetch data from URL
 */
async function fetchDataFromURL(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const csvText = await response.text();

        figma.ui.postMessage({
            type: 'url-data-loaded',
            data: csvText
        });
    } catch (error: any) {
        figma.ui.postMessage({
            type: 'error',
            message: `Failed to load URL: ${error.message}`
        });
    }
}

/**
 * Main certificate generation function
 */
async function generateCertificates(msg: any) {
    if (!selectedTemplateNode) {
        throw new Error('No template selected');
    }

    const records = msg.records;
    const mapping = msg.mapping;

    if (!records || records.length === 0) {
        throw new Error('No data records found');
    }

    if (!mapping || Object.keys(mapping).length === 0) {
        throw new Error('No field mapping provided');
    }

    // Generate certificates
    const certificates: SceneNode[] = [];

    // Re-fetch the node to ensure we have the latest properties/reference
    const templateNode = figma.getNodeById(selectedTemplateNode.id) as FrameNode | ComponentNode | InstanceNode;

    if (!templateNode) {
        throw new Error('Template node not found. Please select it again.');
    }

    console.log(`Template Dimensions: ${templateNode.width}x${templateNode.height}`);

    if (templateNode.width <= 0 || templateNode.height <= 0) {
        throw new Error(`Invalid template dimensions: ${templateNode.width}x${templateNode.height}`);
    }

    // Calculate grid dimensions based on certificate aspect ratio
    const totalCertificates = records.length;
    // Calculate dynamic spacing based on certificate dimensions
    // Use 10% of width/height as a respectful gap, but ensure at least 100px separation
    const horizontalSpacing = Math.max(100, Math.round(templateNode.width * 0.6));
    const verticalSpacing = Math.max(50, Math.round(templateNode.height * 0.1)) - 200;

    // Determine grid layout based on certificate dimensions
    // Wider certificates = more columns, taller certificates = more rows
    const aspectRatio = templateNode.width / templateNode.height;

    // Calculate columns based on aspect ratio and total count
    // For landscape (wide) certificates, use more columns
    // For portrait (tall) certificates, use fewer columns
    const columns = Math.ceil(Math.sqrt(totalCertificates * aspectRatio));
    const rows = Math.ceil(totalCertificates / columns);

    // Starting position: below the template to keep it visible at top
    const startX = templateNode.x;
    const startY = templateNode.y + templateNode.height + verticalSpacing * .3;

    for (let i = 0; i < records.length; i++) {
        const record = records[i];

        // Update progress
        figma.ui.postMessage({
            type: 'progress',
            current: i + 1,
            total: records.length
        });

        // Clone the template
        const clone = templateNode.clone();

        // Try to get a name from the first mapped field
        const firstMappedValue = Object.values(mapping)[0];
        const recordName = record[firstMappedValue as string] || `Certificate ${i + 1}`;
        clone.name = `Certificate - ${recordName}`;

        // Replace text in all text nodes based on layer names
        await replaceTextByLayerName(clone, record, mapping);

        // Calculate grid position
        const row = Math.floor(i / columns);
        const col = i % columns;

        // Position the certificate in grid with precise spacing
        const xOffset = col * (templateNode.width + horizontalSpacing);
        const yOffset = row * (templateNode.height + verticalSpacing);

        clone.x = Math.round(startX + xOffset);
        clone.y = Math.round(startY + yOffset);

        certificates.push(clone);
    }

    // Select all generated certificates
    figma.currentPage.selection = certificates;
    figma.viewport.scrollAndZoomIntoView(certificates);

    figma.ui.postMessage({
        type: 'complete',
        count: certificates.length
    });
}

/**
 * Replace text in nodes based on layer name matching
 */
async function replaceTextByLayerName(node: SceneNode, record: any, mapping: any) {
    if (node.type === 'TEXT') {
        const layerName = node.name.toLowerCase().trim();

        // Check if this layer name is in our mapping
        if (mapping.hasOwnProperty(layerName)) {
            const columnName = mapping[layerName];
            const value = record[columnName] || '';

            if (value) {
                // Load the font before modifying text
                await figma.loadFontAsync(node.fontName as FontName);
                node.characters = value;
            }
        }
    }

    // Process children if the node has them
    if ('children' in node) {
        for (const child of node.children) {
            await replaceTextByLayerName(child, record, mapping);
        }
    }
}

/**
 * Utility function to export certificates as images (optional feature)
 */
async function exportCertificates(nodes: SceneNode[]) {
    const exports: Uint8Array[] = [];

    for (const node of nodes) {
        if ('exportAsync' in node) {
            const bytes = await node.exportAsync({
                format: 'PNG',
                constraint: { type: 'SCALE', value: 2 }
            });
            exports.push(bytes);
        }
    }

    return exports;
}
