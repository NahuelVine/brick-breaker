function loaded() {
    //VARIABLES
    //canvas
    var canvas = document.getElementById("juego");
    var ctx = canvas.getContext("2d");
    //sonido
    var theme = new Audio();
    var pop = new Audio();
    //iniciar
    var start = false;
    //pausa
    var pausa = false;
    //pelota
    var radioPelota = 5;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 0;
    var dy = 1;
    var v = 1.5;
    var color = "#000";
    //paddle
    var paddleHeight = 5;
    var paddleWidth = 50;
    var paddleX = (canvas.width - paddleWidth) / 2
    var rightPressed = false;
    var leftPressed = false;
    //ladrillos
    var ladrilloFilaCount = 4;
    var ladrilloColumnaCount = 5;
    var ladrilloWidth = 40;
    var ladrilloHeight = 10;
    var ladrilloPadding = 8;
    var ladrilloOffsetTop = 25;
    var ladrilloOffsetLeft = 30;
    var ladrillos = [];
    //puntaje
    var score = 0;
    //vidas
    var vidas = 3;
    //angulo
    var angulo = 0;

    //localizo sonidos
    theme.src = "sonidos/theme.mp3";
    pop.src = "sonidos/pop.mp3";

    //relleno array ladrillos
    for (var c = 0; c < ladrilloColumnaCount; c++) {
        ladrillos[c] = [];
        for (var f = 0; f < ladrilloFilaCount; f++) {
            ladrillos[c][f] = { x: 0, y: 0, status: 1 };
        }
    }

    //eventos: tocar y soltar teclas
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    //FUNCIONES
    //funcion tocar tecla
    function keyDownHandler(t) {
        if (t.key == "Right" || t.key == "ArrowRight") {
            rightPressed = true;
        } else if (t.key == "Left" || t.key == "ArrowLeft") {
            leftPressed = true;
        } else if (t.key == "p" || t.key == "P") {
            pausa = !pausa;
        }
        start = true;
    }

    //funcion soltar tecla
    function keyUpHandler(t) {
        if (t.key == "Right" || t.key == "ArrowRight") {
            rightPressed = false;
        } else if (t.key == "Left" || t.key == "ArrowLeft") {
            leftPressed = false;
        }
    }

    //funcion dibujar pelota
    function drawPelota() {
        ctx.beginPath();
        ctx.arc(x, y, radioPelota, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    //funcion dibujar paddle
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.closePath();
    }

    //funcion dibujar ladrillos
    function drawLadrillos() {
        for (var c = 0; c < ladrilloColumnaCount; c++) {
            for (var f = 0; f < ladrilloFilaCount; f++) {
                if (ladrillos[c][f].status == 1) {
                    var ladrilloX = (c * (ladrilloWidth + ladrilloPadding)) + ladrilloOffsetLeft;
                    var ladrilloY = (f * (ladrilloHeight + ladrilloPadding)) + ladrilloOffsetTop;
                    ladrillos[c][f].x = ladrilloX;
                    ladrillos[c][f].y = ladrilloY;
                    ctx.beginPath();
                    ctx.rect(ladrilloX, ladrilloY, ladrilloWidth, ladrilloHeight);
                    ctx.fillStyle = "#882A06";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    //funcion detectar colisión con ladrillos
    function collisionLadrilloDetected() {
        for (var c = 0; c < ladrilloColumnaCount; c++) {
            for (var f = 0; f < ladrilloFilaCount; f++) {
                var l = ladrillos[c][f];
                if (l.status == 1) {
                    if (x + radioPelota > l.x && x - radioPelota < l.x + ladrilloWidth && y + radioPelota > l.y && y - radioPelota < l.y + ladrilloHeight) {
                        if (x < l.x || x > l.x + ladrilloWidth) {
                            dx = -dx;
                        } else {
                            dy = -dy;
                        }
                        l.status = 0;
                        color = "#000";
                        score++;
                        pop.play();
                        aumentarVelocidad();
                    }
                    if (score == ladrilloColumnaCount * ladrilloFilaCount) {
                        alert("GANASTE, PUNTAJE: " + score);
                        document.location.reload();
                    }
                }
            }
        }
    }

    //funcion puntaje
    function drawScore() {
        ctx.font = "15px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Puntaje: " + score, 10, 20);
    }

    //funcion empezar
    function drawStart() {
        ctx.font = "15px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText("Usa las flechas del teclado para moverte", 10, 30);
    }

    //function vidas
    function drawVidas() {
        ctx.font = "15px Arial";
        ctx.fillStyle = "#FF0000";
        ctx.fillText("Vidas: " + vidas, canvas.width - 65, 20);
    }

    function drawPausa() {
        ctx.font = "20px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText("Pausa (p)", (canvas.width / 2) - 50, canvas.height / 2);
    }

    //funcion aumentar velocidad
    function aumentarVelocidad() {
        v *= 1.05;
    }

    //funcion renderiza todo en el canvas
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (start == true) {
            if (pausa == false) {

                if (x + (dx * v) > canvas.width - radioPelota || x + (dx * v) < radioPelota) {
                    dx = -dx;
                    color = "#000";
                }
                if (y + (dy * v) <= radioPelota) {
                    dy = -dy;
                    color = "#000";
                } else if (y + (dy * v) > canvas.height - radioPelota) {
                    if (x + radioPelota >= paddleX && x <= (paddleX + paddleWidth) + radioPelota) {
                        //pelota choca con paddle
                        color = "#882A06";
                        //angulo que sale la pelota
                        if (x < paddleX) {
                            angulo = Number((((Math.PI * (paddleWidth - ((x + radioPelota) - paddleX)))) / paddleWidth).toFixed(1));
                        } else if (x > paddleX + paddleWidth) {
                            angulo = Number((((Math.PI * (paddleWidth - ((x - radioPelota) - paddleX)))) / paddleWidth).toFixed(1));
                        } else {
                            angulo = Number((((Math.PI * (paddleWidth - (x - paddleX)))) / paddleWidth).toFixed(1));
                        }
                        dx = Number(Math.cos(angulo)).toFixed(2);
                        dy = Math.min(-(Number(Math.sin(angulo)).toFixed(2)), -0.1);
                    } else {
                        //pelota toca piso
                        vidas--;
                        if (!vidas) {
                            alert("GAME OVER. PUNTAJE: " + score);
                            document.location.reload();
                        } else {
                            x = canvas.width / 2;
                            y = canvas.height - 30;
                            dx = 0, dy = 1;
                            paddleX = (canvas.width - paddleWidth) / 2;
                            pausa = true;
                        }
                    }
                }
                if (rightPressed) {
                    paddleX += 5;
                    if (paddleX + paddleWidth > canvas.width) {
                        paddleX = canvas.width - paddleWidth;
                    }
                } else if (leftPressed) {
                    paddleX -= 5;
                    if (paddleX < 0) {
                        paddleX = 0;
                    }
                }
                x += dx * v, y += dy * v;
                drawLadrillos();
                drawVidas();
                drawScore();
                collisionLadrilloDetected();
            } else {
                drawVidas();
                drawScore();
                drawLadrillos();
                drawPausa();
            }
        } else {
            theme.play();
            drawStart();
        }
        drawPelota();
        drawPaddle();
        //permite que la función entre en bucle
        requestAnimationFrame(draw);
    }

    draw();
}