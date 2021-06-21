import { DirectiveRegistry, Utils } from '../index.js';
const refDirective = {
  attribute: (_, nodeName) => nodeName === '#ref',
  process: ({ attribute, targetNode, scopeNode }) => {
    const propertyName = attribute.value;
    Object.defineProperty(scopeNode, propertyName, {
      value: targetNode,
      configurable: true
    });
    return {
      update: Utils.NOOP
    };
  }
};

DirectiveRegistry.add(refDirective);