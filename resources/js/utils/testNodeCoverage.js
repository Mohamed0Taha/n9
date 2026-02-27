/**
 * Test utility to verify all nodes have working schemas
 * Run this in browser console to verify coverage
 */

import { n8nNodes } from '../data/n8nNodes.js';
import { getNodeSchema, hasCustomSchema } from '../data/allNodeSchemas.js';

export function testNodeCoverage() {
    console.log('🔍 Testing Node Schema Coverage...\n');
    
    const results = {
        total: n8nNodes.length,
        withCustomSchema: 0,
        withDefaultSchema: 0,
        errors: []
    };
    
    n8nNodes.forEach(node => {
        try {
            const schema = getNodeSchema(node.name);
            
            if (!schema) {
                results.errors.push(`❌ ${node.name}: No schema returned`);
                return;
            }
            
            if (hasCustomSchema(node.name)) {
                results.withCustomSchema++;
                console.log(`✅ ${node.name}: Custom schema`);
            } else {
                results.withDefaultSchema++;
                console.log(`⚙️  ${node.name}: Default schema`);
            }
            
            // Verify schema structure
            if (!schema.fields || !Array.isArray(schema.fields)) {
                results.errors.push(`⚠️  ${node.name}: Invalid schema structure`);
            }
            
        } catch (error) {
            results.errors.push(`❌ ${node.name}: ${error.message}`);
        }
    });
    
    console.log('\n📊 Coverage Summary:');
    console.log(`Total Nodes: ${results.total}`);
    console.log(`Custom Schemas: ${results.withCustomSchema}`);
    console.log(`Default Schemas: ${results.withDefaultSchema}`);
    console.log(`Coverage: ${((results.withCustomSchema + results.withDefaultSchema) / results.total * 100).toFixed(1)}%`);
    
    if (results.errors.length > 0) {
        console.log('\n⚠️  Errors:');
        results.errors.forEach(err => console.log(err));
    } else {
        console.log('\n✅ All nodes have working schemas!');
    }
    
    return results;
}

// Auto-run in development
if (import.meta.env?.DEV) {
    console.log('Node coverage test available: testNodeCoverage()');
}
