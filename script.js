document.getElementById("text-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const text = document.getElementById("text").value;
    const title = document.getElementById("title").value;
    const fontSize = parseInt(document.getElementById("fontSize").value);
    const fontFamily = document.getElementById("fontFamily").value;
    const bgColor = document.getElementById("bgColor").value;
    const textColor = document.getElementById("textColor").value;

    const canvasWidth = 480;
    const canvasHeight = 878;
    const lineSpacing = 4;

    const output = document.getElementById("output");
    output.innerHTML = "";

    const charsPerLine = 43; // 1行の文字数
    const maxLinesPerPage = 18; // 1ページに描画できる最大行数

    // 入力テキストを1行ごとに分割
    const paragraphs = text.split("\n");
    let lines = [];

    paragraphs.forEach((paragraph) => {
        for (let i = 0; i < paragraph.length; i += charsPerLine) {
            lines.push(paragraph.slice(i, i + charsPerLine));
        }
    });

    let currentLines = []; // 現在のページの行
    let currentPage = 1;

    const drawPage = (linesToDraw) => {
        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // ページ番号とタイトルを描画
        ctx.font = `${fontSize / 2}px ${fontFamily}`;
        ctx.fillStyle = textColor;
        ctx.textBaseline = "top";
        ctx.fillText(`~p${currentPage}`, 10, 20);
        ctx.fillText(title, 50, 20);

        // 縦書き描画処理
        let columnX = canvas.width - fontSize - 10; // 最初の列
        let textY = 60;

        linesToDraw.forEach((lineText) => {
            const verticalCanvas = tategaki(
                `${fontSize}px ${fontFamily}`,
                lineText,
                4,
                lineSpacing,
                textColor
            );

            ctx.drawImage(verticalCanvas, columnX, textY);
            columnX -= fontSize + 10; // 次の列に移動

            // 列が収まらない場合、次の行に進む
            if (columnX < fontSize) {
                columnX = canvas.width - fontSize - 10;
                textY += verticalCanvas.height + 20;
            }
        });

        output.appendChild(canvas); // ページを出力
        currentPage++; // ページ番号を更新
    };

    // ページごとにテキストを分割しながら描画
    for (let i = 0; i < lines.length; i++) {
        currentLines.push(lines[i]);

        // 現在の行数が14行を超えた場合、または最後の行である場合
        if (currentLines.length === maxLinesPerPage || i === lines.length - 1) {
            drawPage(currentLines); // 現在のページを描画
            currentLines = []; // 次ページ用にリセット
        }
    }
});
