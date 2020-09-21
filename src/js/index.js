document.addEventListener('DOMContentLoaded', () => {
    /* Get canvas element and context */
    const canvasElement = document.getElementById('canvas');
    const context = canvasElement.getContext('2d');

    /* Get colors flower element */
    const colorFlowerElement = document.querySelector('.colors-flower');
    const colorFlowerButtons = document.querySelectorAll('.colors-flower__button');

    /* Get connected dots element */
    const connectedDotsCountInput = document.querySelector('.connected-dots-count');

    /* Set start mouse positions */
    let POSITIONS = {
        x: 0,
        y: 0,
    };

    /* Array of positions arrays [x, y] */
    const lastPositions = [];

    /* Default params */
    let currentColor = '#000000';
    let connectedDotsCount = 2;

    /* Draw color selector on clicked place */
    const showColorFlower = () => {
        colorFlowerElement.style.top = `${POSITIONS.y}px`;
        colorFlowerElement.style.left = `${POSITIONS.x}px`;
        colorFlowerElement.style.display = 'block';
    };

    /* Hide color selector */
    const hideColorFlower = () => {
        colorFlowerElement.style.display = 'none';
    };

    /* Draw lines method */
    const drawLines = (color) => {
        context.beginPath();

        const lastDotsPositions = lastPositions.slice(-connectedDotsCount); /* Get last n (connectedDotsCount) positions */

        if (lastDotsPositions.length === connectedDotsCount) { /* Check can we connect n dots by lines */

            /* Draw n lines */
            for (let i = 0; i < connectedDotsCount; i++) {
                context.moveTo(POSITIONS.x, POSITIONS.y);
                context.lineTo(lastDotsPositions[i][0], lastDotsPositions[i][1]);

                context.strokeStyle = color; /* Set line color */
                context.lineWidth = 2; /* Set line width */

                context.stroke(); /* Draw on canvas */
            }

        }
        else if (lastDotsPositions.length === lastPositions.length) { /* if dots count less than n */

            /* Draw possible count of lines */
            for (let i = 0; i < lastPositions.length; i++) {
                context.moveTo(POSITIONS.x, POSITIONS.y);
                context.lineTo(lastDotsPositions[i][0], lastDotsPositions[i][1]);

                context.strokeStyle = color;
                context.lineWidth = 2;

                context.stroke();
            }
        }
        else if (lastDotsPositions.length === 1) { /* On first two dots draw line only between them  */
            context.moveTo(POSITIONS.x, POSITIONS.y);
            context.lineTo(lastDotsPositions[0][0], lastDotsPositions[0][1]);

            context.strokeStyle = color;
            context.lineWidth = 2;

            context.stroke();
        }
    };

    /* Method for draw dots */
    const drawDot = () => {
        context.beginPath();

        const color = currentColor; /* Set dot and her lines color */

        context.arc(
            POSITIONS.x,
            POSITIONS.y,
            5,
            0,
            (Math.PI / 180) * 360,
        );

        context.fillStyle = color;

        context.fill();

        drawLines(color); /* Draw lines from current dot */

        lastPositions.push([POSITIONS.x, POSITIONS.y]); /* Push current dot's positions to positions array */
    };

    /* Draw lines from current dot */
    connectedDotsCountInput.addEventListener('change', (event) => {
        connectedDotsCount = Number(event.target.value); /* Get number of connected dots */
    });

    connectedDotsCountInput.addEventListener('keydown', () =>
        false, /* Disable manual enter to input */
    );

    [].forEach.call(colorFlowerButtons, (colorFlowerButton) => { /* IE hack, to bind handle on every button */
        colorFlowerButton.addEventListener('click', (event) => {
            currentColor = event.target.dataset.color; /* Get current color from data-color */
            hideColorFlower(); /* Hide color selector */

            drawDot(); /* Draw dot with selected color */
        });
    });

    canvasElement.addEventListener('click', (event) => {
        const posX = event.clientX; /* Get mouse click X */
        const posY = event.clientY; /* Get mouse click Y */

        POSITIONS = {
            x: posX,
            y: posY,
        }; /* Write to positions object */

        if (lastPositions.length > 1) {
            showColorFlower(); /* If not first two buttons - show color selector */
        }
        else {
            drawDot(); /* First two buttons and line between draw with default color */
        }
    });
});

