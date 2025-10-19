export function MarkupInterpretor({ markdownText }: { markdownText: string }) {
    let markupHtml = "";

    const textToRender:string = markdownText ? markdownText : "Aucune description disponible pour ce dépôt.";

    textToRender.split(';').forEach(line => {
        line = line.replaceAll("\\k","<br>");
        if (line.startsWith("# ")){
            markupHtml += `<h1 class="text-xl">${line.replace("# ", "").trim()}</h1>`;
        } else if (line.startsWith("## ")){
            markupHtml += `<h2 class="text-lg">${line.replace("## ", "").trim()}</h2>`;
        } else if (line.startsWith("### ")){
            markupHtml += `<h3 class="text-base">${line.replace("### ", "").trim()}</h3>`;
        } else {
            markupHtml += `<p>${line.trim()}</p>`;
        }
    })

    return (
        <div dangerouslySetInnerHTML={{ __html: markupHtml }} />
    );
}