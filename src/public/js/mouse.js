const mouseManageBtnUp = document.getElementById('mouseManageBtnUp')
const mouseManageBtnDown = document.getElementById('mouseManageBtnDown')
const mouseManageBtnLeft = document.getElementById('mouseManageBtnLeft')
const mouseManageBtnRight = document.getElementById('mouseManageBtnRight')

let mouseTimer;
let mousePoint = 10;

const moveMouse = (type, p) => {
    mouseTimer = setInterval(() => {
        sio.emit("mouse", {clientId: clientId, type: type, p: p})
    }, 500)
}

const clearMouseTimer = () => {if (mouseTimer) clearInterval(mouseTimer)};

/*
MYSZKA DO GORY
 */
mouseManageBtnUp.addEventListener('mousedown', (e) => moveMouse("y", -mousePoint))
mouseManageBtnUp.addEventListener('touchstart', (e) =>  moveMouse("y", -mousePoint))

mouseManageBtnUp.addEventListener('mouseup', (e) => clearMouseTimer())
mouseManageBtnUp.addEventListener('mouseout', (e) => clearMouseTimer())
mouseManageBtnUp.addEventListener('touchend', (e) => clearMouseTimer())

/*
MYSZKA W DOL
 */
mouseManageBtnDown.addEventListener('mousedown', (e) => moveMouse("y", mousePoint))
mouseManageBtnDown.addEventListener('touchstart', (e) => moveMouse("y", mousePoint))

mouseManageBtnDown.addEventListener('mouseup', (e) => clearMouseTimer())
mouseManageBtnDown.addEventListener('mouseout', (e) => clearMouseTimer())
mouseManageBtnDown.addEventListener('touchend', (e) => clearMouseTimer())

/*
MYSZKA W LEWO
 */
mouseManageBtnLeft.addEventListener('mousedown', (e) => moveMouse("x", -mousePoint))
mouseManageBtnLeft.addEventListener('touchstart', (e) => moveMouse("x", -mousePoint))

mouseManageBtnLeft.addEventListener('mouseup', (e) => clearMouseTimer())
mouseManageBtnLeft.addEventListener('mouseout', (e) => clearMouseTimer())
mouseManageBtnLeft.addEventListener('touchend', (e) => clearMouseTimer())

/*
MYSZKA W PRAWO
 */
mouseManageBtnRight.addEventListener('mousedown', (e) => moveMouse("x", mousePoint))
mouseManageBtnRight.addEventListener('touchstart', (e) => moveMouse("x", mousePoint))

mouseManageBtnRight.addEventListener('mouseup', (e) => clearMouseTimer())
mouseManageBtnRight.addEventListener('mouseout', (e) => clearMouseTimer())
mouseManageBtnRight.addEventListener('touchend', (e) => clearMouseTimer())