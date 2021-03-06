COMPONENTS = [
    "alert",
    "assets",
    "autocomplete",
    "bar-indicator",
    "breadcrumbs",
    "button",
    "button-group",
    "card",
    "chart",
    "checkbox",
    "confirmation-dialog",
    "consumption",
    "container-breakpoint-observer",
    "context-dialog",
    "copy-to-clipboard",
    "core",
    "drawer",
    "empty-state",
    "event-chart",
    "expandable-panel",
    "expandable-section",
    "expandable-text",
    "experimental/combobox",
    "experimental/drawer-table",
    "experimental/quick-filter",
    "filter-field",
    "form-field",
    "formatters",
    "highlight",
    "icon",
    "indicator",
    "info-group",
    "inline-editor",
    "input",
    "key-value-list",
    "legend",
    "loading-distractor",
    "menu",
    "micro-chart",
    "overlay",
    "pagination",
    "progress-bar",
    "progress-circle",
    "radial-chart",
    "radio",
    "schematics",
    "secondary-nav",
    "select",
    "show-more",
    "slider",
    "stepper",
    "style",
    "sunburst-chart",
    "switch",
    "table",
    "tabs",
    "tag",
    "theming",
    "tile",
    "timeline-chart",
    "toast",
    "toggle-button-group",
    "top-bar-navigation",
    "tree-table",
]

# List of all entry point target of the barista components
COMPONENT_TARGETS = ["//libs/barista-components/%s" % c for c in COMPONENTS]
