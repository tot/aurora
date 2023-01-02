module.exports = {
    semi: true,
    trailingComma: "none",
    singleQuote: false,
    tabWidth: 4,
    useTabs: false,
    importOrder: [
        "^@?(?!src|lib|docs|routes|plugins)\\w+",
        "^@src/(.*)$",
        "^@lib/(.*)$",
        "^@routes/(.*)$",
        "^@plugins/(.*)$",
        "^@ui/(.*)$"
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true
};
