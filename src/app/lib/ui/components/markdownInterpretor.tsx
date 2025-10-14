export function MarkupInterpretor({ markdownText }: { markdownText: string }) {
    let markupHtml = "";

    const textToRender = markdownText ? markdownText : "Aucune description disponible pour ce dépôt.";

    textToRender.split(';').forEach(line => {
        markupHtml += `<p>${line}</p>`;
    })

    console.log(markupHtml);

    return (
        <div dangerouslySetInnerHTML={{ __html: markupHtml }} />
    );
}