# View-Specific Components

This folder contains components that are specific to certain views in the application. 
These components are organized by the view they belong to, making it easier to locate and manage view-specific UI elements.

## Structure

- `project/`: Components specific to the project view
- `home/`: Components specific to the home view (to be implemented)
- `user/`: Components specific to the user view (to be implemented)

## Best Practices

1. Keep components in this folder if they are only used in a specific view.
2. If a component becomes reusable across multiple views, consider moving it to the main components folder.
3. Use consistent naming conventions for components, prefixing them with the view name if necessary (e.g., `ProjectCard`, `HomeHeader`).