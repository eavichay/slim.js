# Creating custom directives for slim.js

`Slim` module exports the `DirectiveRegistry`.

Usage:

```javascript
import { DirectiveRegistry } from 'slim-js';

DirectiveRegistry.add(myCustomDirective);
```

## DirectiveRegsitry

### DirectiveRegistry.add(directive: Directive, priority?: boolean)

Registers a new directive. High-Priority directives are executed before default priority directives.

## the `Directive` interface

```typescript
interface Directive {
  /**
   * Tests whether an attribute is relevant for processing the node. The result is converted to boolean
   */
  attribute: (attr: Attr, nodeName: string, nodeValue: string) => any;
  /**
   * If the attribute test function returned a truthy value, the process will be executed
   */
  process: (info: NodeProcessInfo) => NodeProcessResult;
  /**
   * Notifies slim.js to ignore the content of handlebars expression and disabled the execution of it's content
   */
  noExecution?: boolean;
}
```

```typescript
type NodeProcessInfo = {
  /**
   * Usually, the slim.js component that owns the template. Templates can also be bound to objects or other HTMLElements.
   */
  scopeNode: any | Element;

  /**
   * The Element containing the tested attribute
   */
  targetNode: Element;

  /**
   * The localName of the target node.
   */
  targetNodeName: string;

  /**
   * Reference to the tested attribute
   */
  attribute: Attr;

  /**
   * The name of the tested attribute
   */
  attributeName: string;

  /**
   * The DOMString value of the tested attribute
   */
  attributeValue: string | null;

  /**
   * The handlebars custom code
   */
  expression: string;

  /**
   * Additional payload chained through the DOM. For example, if the targetNode was generated by another directive, it can hold additional context
   */
  context: any;

  /**
   * Property names expected to trigger updates when changed
   */
  props: string[];
};

type NodeProcessResult = {
  /**
   * This function, if provided will be executed whenever a relevant property is changed
   */
  update?: ((value: any, forceUpdate: boolean) => any) | undefined;

  /**
   * If true, and not in global debug mode, the attribute will be removed
   */
  removeAttribute?: boolean | undefined;

  /**
   * If true, the node itself will be removed
   */
  removeNode?: boolean | undefined;

  /**
   * Do not invoke the update function unless manually triggered
   */
  noInvocation?: boolean | undefined;
};
```

## Example directive

An example of a directive that listens to keyboard events, waiting for the Enter key to be pressed.

```javascript
import { DirectiveRegistry } from 'slim-js';

DirectiveRegistry.add({
  attribute: (attr, name) => name === ':enter-key',
  process: (info) => {
    const { targetNode, attributeValue } = info;
    const fn = new Function(attributeValue);
    const handleKeyboardEvent = (event) => {
      if (event.key === 'Enter') {
        fn.call(targetNode);
      }
    };
    targetNode.addEventListener('keypress', handleKeyboardEvent);
    return {
      update: undefined, // no DOM updates
      removeAttribute: true, // :enterKey will not appear in the browser
    };
  },
  noExecution: true,
});
```

Usage for the example directive

```javascript
import './path/to/enterkey.directive.js';
```

```html
<input type="text" :enter-key="this.submitInput()" />
```