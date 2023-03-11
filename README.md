# Deduped SVG

Deduped SVG moves svgs out of the normal flow of the document and instead places it in a single location and renders a reference to it in place. To use the library, simply add a `DedupedSVGRenderer` at the top level of your app as the _very_ last thing rendered, and then render the deduped svgs like this:

```tsx
<DedupedSVG id="icon-home">
	<svg>{/* inside */}</svg>
</DedupedSVG>
```

All instances of the svg will instead be replaced with a reference to the single SVG being rendered.
