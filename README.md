# React-Lite

This project will create a simple re-creation of React.js. It will feature the
following:
- A virtual DOM
- Lifecycle implementation
- Reconciliation following React heuristics


Step 1
- `Element` - `#createElement` POJO creator
  - `type`
  - `children`
  - `props`

Step 2
- Render an `Element`
  - `RLDOM#render` method
- Recursively render children

Step 3
- Unmount an `Element` from DOM
  - this will be a helper method when we update components
- Recursively unmount children first, then self

Step 4
- `#diff` between two element trees
  - compare roots
    - if different, unmount prev, mount next
    - if same
      - update node
      - *NB* - if there were no components, but only elements, we would not need to recurse children
      - 
