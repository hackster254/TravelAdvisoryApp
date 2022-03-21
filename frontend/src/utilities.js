// function that allows us to draw on the screen

export const drawRect = (detections, ctx) => {
    // loop through each of our detections

    detections.forEach((prediction) => {
        const [x, y, width, height] = prediction["bbox"];
        const text = prediction["class"];

        //set styling

        const color = "blue";
        ctx.strokeStyle = color;
        ctx.font = "18px Arial";
        ctx.fillStyle = color;

        // draw rectangle and text
        ctx.beginPath();
        ctx.fillText(text, x, y);
        ctx.rect(x, y, width, height);
        ctx.stroke();
    });
};