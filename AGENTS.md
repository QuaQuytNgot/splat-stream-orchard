<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Viewer UI lives in src/components/viewer; integration contract in src/lib/viewer/types.ts. Why: the existing Python DASH framework and browser 3DGS renderer attach via ViewerHost's mount ref + RendererAdapter; never reimplement decoding, ABR, or rendering here.
- src/lib/viewer/usePreviewState.ts is preview-only mock state; replace it with a backend-fed hook. Why: UI must never fabricate measured metrics.
