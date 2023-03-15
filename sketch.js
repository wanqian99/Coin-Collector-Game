/*

Game Project 8

*/


var cloudspeed = [0.07, 0.15, 0.25];
var changeDirection = false;

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var trees_y;
var canyon;
var collectable;
var carrot;

var game_score;
var flagpole;

var lives;

var jumpSound;
var coinSound;
var splashSound;
var splash;

var winSound;
var win
var loseSound;

var backgroundSound;
var background;

var uhohSound;

var platforms;
var enemies;


//One of the extensions I added to my game is sound. I implemented different sounds when the game character does something. I added sound when the game character jumps, 'drowns' in the water, completed the game, lost the game, collected a collectable or carrot, touched an enemy, and background music as well. The background music was particulary hard to implement, as it played continuously, and overlapped, making it sound weird. I made it such that it would play the sound when the game starts, and until it is done playing, it loops the backgroud sound and play again. When the game ends (either level complete or incomplete), I made the background sound stop, to not overlap the different sounds. Through this extension, I've learned more about implementing sounds, how to make it stop/ start in different functions, and how to loop it.
// ------------------------------
// Preload sounds function
// ------------------------------
function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.5);
    
    coinSound = loadSound('assets/coin.wav');
    coinSound.setVolume(1.0);
    
    splashSound = loadSound('assets/splash.mp3');
    splashSound.setVolume(1.5);
    
    winSound = loadSound('assets/win.mp3');
    winSound.setVolume(2.0);
    
    loseSound = loadSound('assets/lose.wav');
    loseSound.setVolume(2.0);
    
    backgroundSound = loadSound('assets/background.mp3');
    backgroundSound.setVolume(2.0);
    
    uhohSound = loadSound('assets/uhoh.wav');
    uhohSound.setVolume(1.0);
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    
    lives = [{x: 50, y: 150},
             {x: 100, y: 150},
             {x: 150, y: 150}];

    startGame();
}


function startGame()
{
    backgroundSound.playMode('untilDone');
    backgroundSound.loop();
    
    splash = false;
    win = false;
    lose = false;
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [-500, 0, 512, 912, 1600];
    trees_y = height/2;
    
    clouds = [{x_pos: -650, y_pos: 100, scale: 1.0},
              {x_pos: -480, y_pos: 190, scale: 1.0},
              {x_pos: -130, y_pos: 130, scale: 1.5},
              {x_pos: 100, y_pos: 100, scale: 1.0},
              {x_pos: 350, y_pos: 190, scale: 1.5},
              {x_pos: 700, y_pos: 130, scale: 1.0},
              {x_pos: 1000, y_pos: 100, scale: 1.2},
              {x_pos: 1200, y_pos: 190, scale: 1.0},
              {x_pos: 1500, y_pos: 130, scale: 1.5}];
    
    mountains = [{x1_pos: 30, y1_pos: 192, 
                  x2_pos: 30, y2_pos: 0, 
                  x3_pos: 160, y3_pos: 192},
                 {x1_pos: 600, y1_pos: 192, 
                  x2_pos: 600, y2_pos: 0, 
                  x3_pos: 730, y3_pos: 192},];
    
    canyon = [{x_pos: 576, y_pos: 432,width: 122},
              {x_pos: -376, y_pos: 432,width: 122}];
    
    collectable = [{x_pos: -400, y_pos: 400, size:50, isFound: false},
                   {x_pos: -310, y_pos: 340, size:50, isFound: false},
                   {x_pos: -225, y_pos: 400, size:50, isFound: false},
                   {x_pos: -150, y_pos: 400, size:50, isFound: false},
                   {x_pos: 140, y_pos: 300, size:50, isFound: false},
                   {x_pos: 230, y_pos: 300, size:50, isFound: false},
                   {x_pos: 400, y_pos: 200, size:50, isFound: false},
                   {x_pos: 555, y_pos: 400, size:50, isFound: false},
                   {x_pos: 642, y_pos: 300, size:50, isFound: false},
                   {x_pos: 725, y_pos: 400, size:50, isFound: false},
                   {x_pos: 805, y_pos: 400, size:50, isFound: false},
                   {x_pos: 1000, y_pos: 200, size:50, isFound: false},
                   {x_pos: 1150, y_pos: 300, size:50, isFound: false},
                   {x_pos: 1300, y_pos: 400, size:50, isFound: false},
                   {x_pos: 1400, y_pos: 400, size:50, isFound: false},
                   {x_pos: 1500, y_pos: 400, size:50, isFound: false}];
    
    carrot = [{x_pos: 905, y_pos: 200, size:50, isFound: false}];
    
    game_score = 0;
    
    carrot_score = 0;
    
    score = {x_pos: 40, y_pos: 35, size:50};
    
    carrotscore = {x_pos: 200, y_pos: 35}
    
    flagpole = {isReached: false, x_pos: 1500};
    
    platforms = [];
    
    platforms.push(createPlatforms(85, floorPos_y-100, 205));
    platforms.push(createPlatforms(1100, floorPos_y-100, 100));
    platforms.push(createPlatforms(350, floorPos_y-200, 100));
    platforms.push(createPlatforms(850, floorPos_y-200, 205));
    
    enemies = [];
    
    enemies.push(new Enemy(100, floorPos_y-10, 100));
    enemies.push(new Enemy(200, floorPos_y-10, 100));
    enemies.push(new Enemy(1150, floorPos_y-10, 100));
    enemies.push(new Enemy(-600, floorPos_y-10, 100));
}

function draw()
{
	background(255, 212, 235); // fill the sky pink

	noStroke();
	fill(176, 255, 176);
	rect(0, floorPos_y, width, height/4); // draw some green ground

    //stop character from going left
    if(gameChar_world_x < -700)
    {
        isLeft  = 0;
    }
    
    push();
    translate(scrollPos,0);

    //pink background behind water
    fill(255, 212, 235)
    rect(576,432,120,144);
    rect(-376,432,120,144);
    
	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();

	// Draw trees.
    drawTrees();
    
    //Draw platforms
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    //Draw enemies
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
        
        if(isContact)
        {
            if(lives.length > 0)
            {
                lives.length -= 1;
                uhohSound.play();
                startGame();
                break;
            }
        }
    }

	// Draw collectable items.
    for(var i = 0; i < collectable.length; i++)
    {
        if(collectable[i].isFound == false)
        {
            drawCollectable(collectable[i]);
            checkCollectable(collectable[i]);
        }
    }
    
    // Draw carrot
    for(var i = 0; i < carrot.length; i++)
    {
        if(carrot[i].isFound == false)
        {
            drawCarrot(carrot[i]);
            checkCarrot(carrot[i]);
        }
    }
    
    renderFlagpole();
    pop();
    
	// Draw game character.
	drawGameChar();
    
    push();
    translate(scrollPos,0);
    // Draw canyons.
    for(var i = 0; i < canyon.length; i++)
    {
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
        if(isPlummeting == true && gameChar_y > floorPos_y + 35)
        {
            fallinwater();
        }
    }
    //play sound only once
    function fallinwater()
    {
        if(splash == false)
        {
            splashSound.play();
            splash = true;
        } 
    }
    pop();
    
    drawScore();
    
    drawCarrotscore();
    
    //draw game score on screen
    fill(255);
    noStroke();
    textSize(25)
    text(": " + game_score + " /16", 50,40);
    
    //draw carrot score on screen
    fill(255);
    noStroke();
    textSize(25)
    text(": " + carrot_score + " /1", 175,40);
    
    //draw lives on screen
    for(var i = 0; i < lives.length; i++)
    {
        drawPlayerLives(lives[i]);
        checkPlayerDie();
    }
    
    if(lives < 1)
    {
        stroke(80, 170, 255,200);
        strokeWeight(5);
        fill(0,0,0,100);
        rect(150,135,725,300,20);
        
        noStroke();
        textSize(55)
        fill(255,0,0);
        text("GAME OVER", width/2 - 165, height/2 - 25);
        fill(255);
        textSize(35)
        text("You died...", width/2 - 80, height/2 + 45);
        textSize(20)
        text("Press space to continue", width/2+115, height/2 + 120);
        
        levellose();
        return;
    }
    else if(flagpole.isReached && carrot_score < 1)
    {
        stroke(80, 170, 255,200);
        strokeWeight(5);
        fill(0,0,0,100);
        rect(150,135,725,300,20);
        
        noStroke();
        textSize(55)
        fill(255,0,0);
        text("LEVEL INCOMPLETE!", width/2 - 250, height/2 - 25);
        fill(255);
        textSize(35)
        text("You did not find the carrot...", width/2 - 215, height/2 + 45);
        textSize(20)
        text("Press space to continue", width/2 + 115, height/2 + 120);
        
        levellose();
        return;
    }
    else if(flagpole.isReached && carrot_score == 1)
    {
        stroke(80, 170, 255,200);
        strokeWeight(5);
        fill(0,0,0,100);
        rect(150,135,725,300,20);
        
        noStroke();
        textSize(55)
        fill(0, 255, 0);
        text("LEVEL COMPLETE!", width/2 - 250, height/2 - 25);
        fill(255);
        textSize(35)
        text("You found the carrot!", width/2 - 150, height/2 + 45);
        textSize(20)
        text("Press space to continue", width/2 + 115, height/2 + 120);

        levelcomplete();
        return;
    }
    
    function levelcomplete()
    {
        if(win == false)
        {
            winSound.play();
            win = true;
            if(winSound.isPlaying)
            {
                backgroundSound.stop();
            }
        }
    }
    
    function levellose()
    {
        if(lose == false)
        {
            loseSound.play();
            lose = true;
            if(loseSound.isPlaying)
            {
                backgroundSound.stop();
            }
        }
    }
    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
            {
                isContact = true;
                isFalling = false;
                break;
            }
        }
        if(isContact == false)
        {
            gameChar_y += 3;
            isFalling = true;
        }
    }
    else
    {
        isFalling = false;
    }
    
    if(isPlummeting == true)
    {
        gameChar_y += 3;
    }

    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------
function keyPressed()
{
    if(flagpole.isReached && key == ' ')
    {
        nextLevel();
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
    }
    
    if(key == 'A' || keyCode == 37)
    {
        isLeft = true;
    }

    if(key == 'D' || keyCode == 39)
    {
        isRight = true;
    }

    if(keyCode == 32 && gameChar_y == floorPos_y)
    {
        console.log("Spacebar");
        gameChar_y -= 150;
        jumpSound.play();
    }
    
    for(var i = 0; i < platforms.length; i++)
    {
        if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true && keyCode == 32)
        {
            console.log("Spacebar");
            gameChar_y -= 150;
            jumpSound.play();
        }
    }
}

function keyReleased()
{
	if(key == 'A' || keyCode == 37)
	{
		isLeft = false;
	}

	if(key == 'D' || keyCode == 39)
	{
		isRight = false;
	}
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        //ears
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        ellipse(gameChar_x-2,gameChar_y-47,8,30);//ear1st
        
        fill(255, 191, 246);//pink1
        ellipse(gameChar_x-4,gameChar_y-47,4,18);
        
        fill(255);//ear2nd
        ellipse(gameChar_x,gameChar_y-47,8,30);
        
        fill(255, 191, 246);//pink2
        ellipse(gameChar_x-1,gameChar_y-47,3,18);
        
        //leg
        fill(255);
        ellipse(gameChar_x,gameChar_y-8,6,12);
        ellipse(gameChar_x-3,gameChar_y-8,6,12);
        
        //head
        fill(255);
        ellipse(gameChar_x,gameChar_y-27,27,30);
        
        //mouth
        stroke(0);
        strokeWeight(0.5);
        beginShape(LINES);
        vertex(gameChar_x-9,gameChar_y-16);
        vertex(gameChar_x-7,gameChar_y-19);
        endShape();
        
        //blush
        stroke(0);
        strokeWeight(1);
        stroke(255, 191, 246);
        noFill();
        line(gameChar_x-13,gameChar_y-25,gameChar_x-10,gameChar_y-27);
        line(gameChar_x-10,gameChar_y-25,gameChar_x-7,gameChar_y-27);
        
        //eyes
        fill(0);
        noStroke();
        ellipse(gameChar_x-8,gameChar_y-28,5);
        
        //hands
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        ellipse(gameChar_x,gameChar_y-33,5);
        line(gameChar_x,gameChar_y-28,gameChar_x,gameChar_y-30);
        
        //tail
        fill(255, 191, 246);
        ellipse(gameChar_x+12,gameChar_y-17,3);
	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        //ears
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        ellipse(gameChar_x+2,gameChar_y-47,8,30);//ear1st
        
        fill(255, 191, 246);//pink1
        ellipse(gameChar_x+4,gameChar_y-47,4,18);
        
        fill(255);//ear2nd
        ellipse(gameChar_x,gameChar_y-47,8,30);
        
        fill(255, 191, 246);//pink2
        ellipse(gameChar_x+1,gameChar_y-47,3,18);
        
        //leg2
        fill(255);
        ellipse(gameChar_x,gameChar_y-8,6,12);
        ellipse(gameChar_x+3,gameChar_y-8,6,12);
        
        //head
        fill(255);
        ellipse(gameChar_x,gameChar_y-27,27,30);
        
        //mouth
        stroke(0);
        strokeWeight(0.5);
        beginShape(LINES);
        vertex(gameChar_x+9,gameChar_y-16);
        vertex(gameChar_x+7,gameChar_y-19);
        endShape();
        
        //blush
        stroke(0);
        strokeWeight(1);
        stroke(255, 191, 246);
        noFill();
        line(gameChar_x+13,gameChar_y-25,gameChar_x+10,gameChar_y-27);
        line(gameChar_x+10,gameChar_y-25,gameChar_x+7,gameChar_y-27);
        
        //eyes
        fill(0);
        noStroke();
        ellipse(gameChar_x+8,gameChar_y-28,5);
        
        //hands
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        ellipse(gameChar_x,gameChar_y-33,5);
        line(gameChar_x,gameChar_y-28,gameChar_x,gameChar_y-30);
        
        //tail
        fill(255, 191, 246);
        ellipse(gameChar_x-12,gameChar_y-17,3);
	}
	else if(isLeft)
	{
		// add your walking left code
        //ears
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        ellipse(gameChar_x-2,gameChar_y-35,8,30);//ear1st
        
        fill(255, 191, 246);//pink1
        ellipse(gameChar_x-4,gameChar_y-35,4,18);
        
        fill(255);//ear2nd
        ellipse(gameChar_x,gameChar_y-35,8,30);
        
        fill(255, 191, 246);//pink2
        ellipse(gameChar_x-1,gameChar_y-35,3,18);
        
        //leg2
        fill(255);
        ellipse(gameChar_x,gameChar_y,9,6);
        
        //head
        fill(255);
        ellipse(gameChar_x,gameChar_y-15,27,30);
        
        //leg1
        ellipse(gameChar_x-6,gameChar_y-1,9,6);
        
        //mouth
        stroke(0);
        strokeWeight(0.5);
        beginShape(LINES);
        vertex(gameChar_x-9,gameChar_y-4);
        vertex(gameChar_x-7,gameChar_y-7);
        endShape();
        
        //blush
        stroke(0);
        strokeWeight(1);
        stroke(255, 191, 246);
        noFill();
        line(gameChar_x-13,gameChar_y-13,gameChar_x-10,gameChar_y-15);
        line(gameChar_x-10,gameChar_y-13,gameChar_x-7,gameChar_y-15);
        
        //eyes
        fill(0);
        noStroke();
        ellipse(gameChar_x-8,gameChar_y-16,5);
        
        //hands
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        ellipse(gameChar_x,gameChar_y-16,5);
        
        //tail
        fill(255, 191, 246);
        ellipse(gameChar_x+12,gameChar_y-5,3);
	}
	else if(isRight)
	{
		// add your walking right code
        //ears
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        ellipse(gameChar_x+2,gameChar_y-35,8,30);//ear1st
        
        fill(255, 191, 246);//pink1
        ellipse(gameChar_x+4,gameChar_y-35,4,18);
        
        fill(255);//ear2nd
        ellipse(gameChar_x,gameChar_y-35,8,30);
        
        fill(255, 191, 246);//pink2
        ellipse(gameChar_x+1,gameChar_y-35,3,18);
        
        //leg2
        fill(255);
        ellipse(gameChar_x,gameChar_y,9,6);
        
        //head
        fill(255);
        ellipse(gameChar_x,gameChar_y-15,27,30);
        
        //leg1
        ellipse(gameChar_x+6,gameChar_y-1,9,6);
        
        //mouth
        stroke(0);
        strokeWeight(0.5);
        beginShape(LINES);
        vertex(gameChar_x+9,gameChar_y-4);
        vertex(gameChar_x+7,gameChar_y-7);
        endShape();
        
        //blush
        stroke(0);
        strokeWeight(1);
        stroke(255, 191, 246);
        noFill();
        line(gameChar_x+13,gameChar_y-13,gameChar_x+10,gameChar_y-15);
        line(gameChar_x+10,gameChar_y-13,gameChar_x+7,gameChar_y-15);
        
        //eyes
        fill(0);
        noStroke();
        ellipse(gameChar_x+8,gameChar_y-16,5);
        
        //hands
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        ellipse(gameChar_x,gameChar_y-16,5);
        
        //tail
        fill(255, 191, 246);
        ellipse(gameChar_x-12,gameChar_y-5,3);
	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        //ears
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        ellipse(gameChar_x-6,gameChar_y-47,8,30);
        ellipse(gameChar_x+6,gameChar_y-47,8,30);
        fill(255, 191, 246);
        ellipse(gameChar_x-6,gameChar_y-47,4,18);
        ellipse(gameChar_x+6,gameChar_y-47,4,18);
        
        //legs
        fill(255);
        ellipse(gameChar_x-4,gameChar_y-8,6,12);
        ellipse(gameChar_x+4,gameChar_y-8,6,12);
        
        //head
        fill(255);
        ellipse(gameChar_x,gameChar_y-27,35,30);
        
        //eyes
        fill(0);
        noStroke();
        ellipse(gameChar_x-10,gameChar_y-28,5);
        ellipse(gameChar_x+10,gameChar_y-28,5);
        
        //mouth
        stroke(0);
        strokeWeight(0.5);
        beginShape(LINES);
        vertex(gameChar_x-2,gameChar_y-19);
        vertex(gameChar_x,gameChar_y-16);
        vertex(gameChar_x,gameChar_y-16);
        vertex(gameChar_x+2,gameChar_y-19);
        endShape();
        
        //blush
        stroke(0);
        strokeWeight(1);
        stroke(255, 191, 246);
        noFill();
        line(gameChar_x-7,gameChar_y-25,gameChar_x-4,gameChar_y-27);
        line(gameChar_x-4,gameChar_y-25,gameChar_x-1,gameChar_y-27);
        line(gameChar_x-1,gameChar_y-25,gameChar_x+2,gameChar_y-27);
        line(gameChar_x+2,gameChar_y-25,gameChar_x+5,gameChar_y-27);
        
        //hands
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        ellipse(gameChar_x-19,gameChar_y-33,5);
        ellipse(gameChar_x+19,gameChar_y-33,5);
        }
	else
	{
		// add your standing front facing code
        //ears
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        ellipse(gameChar_x-6,gameChar_y-37,8,30);
        ellipse(gameChar_x+6,gameChar_y-37,8,30);
        fill(255, 191, 246);
        ellipse(gameChar_x-6,gameChar_y-37,4,18);
        ellipse(gameChar_x+6,gameChar_y-37,4,18);
        
        //head
        fill(255);
        ellipse(gameChar_x,gameChar_y-17,35,30);
        
        //eyes
        fill(0);
        noStroke();
        ellipse(gameChar_x-10,gameChar_y-18,5);
        ellipse(gameChar_x+10,gameChar_y-18,5);
        
        //mouth
        stroke(0);
        strokeWeight(0.5);
        beginShape(LINES);
        vertex(gameChar_x-2,gameChar_y-9);
        vertex(gameChar_x,gameChar_y-6);
        vertex(gameChar_x,gameChar_y-6);
        vertex(gameChar_x+2,gameChar_y-9);
        endShape();
        
        //blush
        stroke(0);
        strokeWeight(1);
        stroke(255, 191, 246);
        noFill();
        line(gameChar_x-7,gameChar_y-15,gameChar_x-4,gameChar_y-17);
        line(gameChar_x-4,gameChar_y-15,gameChar_x-1,gameChar_y-17);
        line(gameChar_x-1,gameChar_y-15,gameChar_x+2,gameChar_y-17);
        line(gameChar_x+2,gameChar_y-15,gameChar_x+5,gameChar_y-17);
        
        //hands
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        ellipse(gameChar_x-20,gameChar_y-18,5);
        ellipse(gameChar_x+20,gameChar_y-18,5);
        
        //legs
        ellipse(gameChar_x-8,gameChar_y-1,9,6);
        ellipse(gameChar_x+8,gameChar_y-1,9,6);
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
        fill(255,255,255);
        //cloud
        ellipse(clouds[i].x_pos+120,clouds[i].y_pos+15,
                150*clouds[i].scale,30*clouds[i].scale);
        ellipse(clouds[i].x_pos+90,clouds[i].y_pos,
                50*clouds[i].scale,30*clouds[i].scale);
        ellipse(clouds[i].x_pos+120,clouds[i].y_pos,
                50*clouds[i].scale,50*clouds[i].scale);
        ellipse(clouds[i].x_pos+150,clouds[i].y_pos,
                50*clouds[i].scale,30*clouds[i].scale);

        if(clouds[i].x_pos <= 1800)
        {
        clouds[0].x_pos += random(cloudspeed[1]);
        clouds[1].x_pos += random(cloudspeed[2]);
        clouds[2].x_pos += random(cloudspeed[0]);
        clouds[3].x_pos += random(cloudspeed[1]);
        clouds[4].x_pos += random(cloudspeed[0]);
        clouds[5].x_pos += random(cloudspeed[2]);
        clouds[6].x_pos += random(cloudspeed[0]);
        clouds[7].x_pos += random(cloudspeed[1]);
        clouds[8].x_pos += random(cloudspeed[0]);
        }
        else if(clouds[i].x_pos >= 1800)
        {
            clouds[i].x_pos = -500;
        }
    }
        
}

// Function to draw mountains objects.
function drawMountains()
{
     for(var i = 0; i < mountains.length; i++)
    {
        push();
        scale(1.5);
        //mountain1
        push();
        scale(1.5)
        fill(70,70,85);
        triangle(mountains[i].x1_pos-70, mountains[i].y1_pos, 
                 mountains[i].x2_pos+30, mountains[i].y2_pos+30, 
                 mountains[i].x3_pos, mountains[i].y3_pos);
        pop();
        //mountain3
        fill(70,70,70);
        triangle(mountains[i].x1_pos+60, mountains[i].y1_pos+96, 
                 mountains[i].x2_pos+160, mountains[i].y2_pos+126, 
                 mountains[i].x3_pos+130, mountains[i].y3_pos+96);
        //mountain2
        fill(80,80,80);
        triangle(mountains[i].x1_pos, mountains[i].y1_pos+96, 
                 mountains[i].x2_pos+100, mountains[i].y2_pos+156, 
                 mountains[i].x3_pos+70, mountains[i].y3_pos+96);
        //mountain4
        fill(90,90,110);
        triangle(mountains[i].x1_pos+185, mountains[i].y1_pos+96, 
                 mountains[i].x2_pos+240, mountains[i].y2_pos+206, 
                 mountains[i].x3_pos+155, mountains[i].y3_pos+96);

        fill(255,255,255);
        //mountain white 1
        push();
        scale(1.5)
        beginShape();
        vertex(mountains[i].x1_pos+30, mountains[i].y1_pos-162);//1
        vertex(mountains[i].x1_pos-20, mountains[i].y1_pos-82);//6
        vertex(mountains[i].x1_pos+20, mountains[i].y1_pos-127);//5
        vertex(mountains[i].x1_pos+25, mountains[i].y1_pos-112);//4
        vertex(mountains[i].x1_pos+45, mountains[i].y1_pos-122);//3
        vertex(mountains[i].x1_pos+61, mountains[i].y1_pos-112);//2
        endShape(CLOSE);
        pop();
        
        //mountain white 3
        beginShape();
        vertex(mountains[i].x1_pos+160, mountains[i].y1_pos-66);
        vertex(mountains[i].x1_pos+209, mountains[i].y1_pos+14);
        vertex(mountains[i].x1_pos+168, mountains[i].y1_pos-31);
        vertex(mountains[i].x1_pos+155, mountains[i].y1_pos-16);
        vertex(mountains[i].x1_pos+145, mountains[i].y1_pos-26);
        vertex(mountains[i].x1_pos+129, mountains[i].y1_pos-16);
        endShape(CLOSE);
        
        //mountain white 2
        beginShape();
        vertex(mountains[i].x1_pos+100, mountains[i].y1_pos-36);
        vertex(mountains[i].x1_pos+119, mountains[i].y1_pos-11);
        vertex(mountains[i].x1_pos+98, mountains[i].y1_pos-21);
        vertex(mountains[i].x1_pos+62, mountains[i].y1_pos+14);
        endShape(CLOSE);
        
        //mountain white 4
        beginShape();
        vertex(mountains[i].x1_pos+240, mountains[i].y1_pos+14);
        vertex(mountains[i].x1_pos+262, mountains[i].y1_pos+54);
        vertex(mountains[i].x1_pos+238, mountains[i].y1_pos+27);
        vertex(mountains[i].x1_pos+227, mountains[i].y1_pos+34);
        endShape(CLOSE);

        pop();
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        //leaves1
        noStroke();
        fill(226, 179, 255);
        ellipse(trees_x[i]-3, trees_y+52, 55, 65);
        ellipse(trees_x[i]-25, trees_y+57, 40, 40);
        ellipse(trees_x[i]-38, trees_y+37, 45, 42);
        ellipse(trees_x[i]-3, trees_y+12, 65, 50);
        ellipse(trees_x[i]+33, trees_y+37, 45, 42);
        ellipse(trees_x[i]+20, trees_y+57, 40, 40);

        //trunk1
        fill(163, 123, 106);
        beginShape();
        vertex(trees_x[i]-22, trees_y+144);
        vertex(trees_x[i]-15, trees_y+127);
        vertex(trees_x[i]-10, trees_y+82);
        vertex(trees_x[i]-15, trees_y+62);
        vertex(trees_x[i]-10, trees_y+53);
        vertex(trees_x[i]-5, trees_y+82);
        vertex(trees_x[i]-5, trees_y+43);
        vertex(trees_x[i], trees_y+43);
        vertex(trees_x[i], trees_y+82);
        vertex(trees_x[i]+7, trees_y+53);
        vertex(trees_x[i]+12, trees_y+62);
        vertex(trees_x[i]+5, trees_y+82);
        vertex(trees_x[i]+11, trees_y+127);
        vertex(trees_x[i]+20, trees_y+144);
        endShape(CLOSE);

        //grass1-1
        fill(93, 179, 93);
        triangle(trees_x[i]-50, trees_y+157, 
                 trees_x[i]-45, trees_y+147, 
                 trees_x[i]-40, trees_y+157);
        triangle(trees_x[i]-45, trees_y+157, 
                 trees_x[i]-37, trees_y+142, 
                 trees_x[i]-30, trees_y+157);

        //grass1-2
        triangle(trees_x[i]-10, trees_y+167, 
                 trees_x[i]-5, trees_y+154, 
                 trees_x[i], trees_y+167);
        triangle(trees_x[i]-5, trees_y+167, 
                 trees_x[i]+2, trees_y+158, 
                 trees_x[i]+8, trees_y+167);

        //grass1-3
        triangle(trees_x[i]+35, trees_y+149, 
                 trees_x[i]+40, trees_y+139, 
                 trees_x[i]+45, trees_y+149);
        triangle(trees_x[i]+40, trees_y+149, 
                 trees_x[i]+48, trees_y+134, 
                 trees_x[i]+55, trees_y+149);
        triangle(trees_x[i]+50, trees_y+149, 
                 trees_x[i]+55, trees_y+139, 
                 trees_x[i]+60, trees_y+149);
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
    noStroke();
    //grey1-1
    fill(70);
    beginShape()
    vertex(t_canyon.x_pos+10,t_canyon.y_pos);
    vertex(t_canyon.x_pos,t_canyon.y_pos+12);
    vertex(t_canyon.x_pos+5,t_canyon.y_pos+40);
    vertex(t_canyon.x_pos+20,t_canyon.y_pos+47);
    endShape(CLOSE);
    
    //grey1-2
    beginShape()
    vertex(t_canyon.x_pos+20,t_canyon.y_pos+47);
    vertex(t_canyon.x_pos+150,t_canyon.y_pos+576);
    vertex(t_canyon.x_pos+20,t_canyon.y_pos+144);
    endShape(CLOSE);
    
    //green1
    fill(176, 255, 176);
    beginShape()
    vertex(t_canyon.x_pos-3,t_canyon.y_pos);
    vertex(t_canyon.x_pos+10,t_canyon.y_pos);
    vertex(t_canyon.x_pos,t_canyon.y_pos+12);
    vertex(t_canyon.x_pos+5,t_canyon.y_pos+40);
    vertex(t_canyon.x_pos+25,t_canyon.y_pos+50);
    vertex(t_canyon.x_pos+28,t_canyon.y_pos+95);
    vertex(t_canyon.x_pos+42,t_canyon.y_pos+100);
    vertex(t_canyon.x_pos+50,t_canyon.y_pos+144);
    vertex(t_canyon.x_pos-3,t_canyon.y_pos+144);
    endShape(CLOSE);
    
    //grey1-3
    fill(70);
    beginShape()
    vertex(t_canyon.x_pos+48,t_canyon.y_pos+134);
    vertex(t_canyon.x_pos+50,t_canyon.y_pos+144);
    vertex(t_canyon.x_pos+20,t_canyon.y_pos+144);
    endShape(CLOSE);
    
    //grey2-1
    beginShape()
    vertex(t_canyon.x_pos+t_canyon.width-9,t_canyon.y_pos);
    vertex(t_canyon.x_pos+t_canyon.width+13,t_canyon.y_pos)
    vertex(t_canyon.x_pos+t_canyon.width+8,t_canyon.y_pos+90);
    vertex(t_canyon.x_pos+t_canyon.width-5,t_canyon.y_pos+90);
    endShape(CLOSE);
    
    //green2
    fill(176, 255, 176);
    beginShape()
    vertex(t_canyon.x_pos+t_canyon.width+13,t_canyon.y_pos)
    vertex(t_canyon.x_pos+t_canyon.width-9,t_canyon.y_pos);
    vertex(t_canyon.x_pos+t_canyon.width+3,t_canyon.y_pos+10);
    vertex(t_canyon.x_pos+t_canyon.width+8,t_canyon.y_pos+25);
    vertex(t_canyon.x_pos+t_canyon.width-2,t_canyon.y_pos+32);
    vertex(t_canyon.x_pos+t_canyon.width-12,t_canyon.y_pos+55);
    vertex(t_canyon.x_pos+t_canyon.width-2,t_canyon.y_pos+75);
    vertex(t_canyon.x_pos+t_canyon.width-12,t_canyon.y_pos+83);
    vertex(t_canyon.x_pos+t_canyon.width-22,t_canyon.y_pos+144);
    vertex(t_canyon.x_pos+t_canyon.width+13,t_canyon.y_pos+144);
    endShape(CLOSE);
    
    //Draw water
    noStroke();
    fill(80, 170, 255,200);
    beginShape()
    vertex(t_canyon.x_pos+15,t_canyon.y_pos+32);
    vertex(t_canyon.x_pos+4,t_canyon.y_pos+35);
    vertex(t_canyon.x_pos+5,t_canyon.y_pos+40);
    vertex(t_canyon.x_pos+25,t_canyon.y_pos+50);
    vertex(t_canyon.x_pos+28,t_canyon.y_pos+95);
    vertex(t_canyon.x_pos+42,t_canyon.y_pos+100);
    vertex(t_canyon.x_pos+48,t_canyon.y_pos+134);
    vertex(t_canyon.x_pos+20,t_canyon.y_pos+144);
    vertex(t_canyon.x_pos+t_canyon.width-22,t_canyon.y_pos+144);
    vertex(t_canyon.x_pos+t_canyon.width-12,t_canyon.y_pos+83);
    vertex(t_canyon.x_pos+t_canyon.width-2,t_canyon.y_pos+75);
    vertex(t_canyon.x_pos+t_canyon.width-12,t_canyon.y_pos+55);
    vertex(t_canyon.x_pos+t_canyon.width-2,t_canyon.y_pos+32);
    vertex(t_canyon.x_pos,t_canyon.y_pos+32);
    endShape(CLOSE);
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos + 30 && 
       gameChar_world_x < t_canyon.x_pos + t_canyon.width - 30 && 
       gameChar_y >= floorPos_y)
    {
        console.log("drop");
        isPlummeting = true;
        isLeft = false;
        isRight = false;
    }
}


// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    fill(250,196,0);
    ellipse(t_collectable.x_pos,t_collectable.y_pos,
            t_collectable.size-20,t_collectable.size-10);
    
    fill(252,214,73);
    ellipse(t_collectable.x_pos-5,t_collectable.y_pos,
            t_collectable.size-20,t_collectable.size-10);
    
    fill(250,196,0);
    beginShape();
    vertex(t_collectable.x_pos-12,t_collectable.y_pos+10);
    vertex(t_collectable.x_pos-15,t_collectable.y_pos-3);
    vertex(t_collectable.x_pos-9,t_collectable.y_pos);
    vertex(t_collectable.x_pos-5,t_collectable.y_pos-13);
    vertex(t_collectable.x_pos-1,t_collectable.y_pos);
    vertex(t_collectable.x_pos+5,t_collectable.y_pos-3);
    vertex(t_collectable.x_pos+2,t_collectable.y_pos+10);
    endShape(CLOSE);
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) 
       < t_collectable.size)
    {
        console.log("found");
        t_collectable.isFound = true;
        game_score += 1;
        coinSound.play();
    }
}

// ----------------------------------
// Carrot render and check functions
// ----------------------------------

// Function to draw carrot.
function drawCarrot(t_carrot)
{
    fill(92,198,98);
    stroke(255);
    ellipse(t_carrot.x_pos-5,t_carrot.y_pos-18,8,12);
    ellipse(t_carrot.x_pos+5,t_carrot.y_pos-18,8,12);
    ellipse(t_carrot.x_pos,t_carrot.y_pos-22,8,18);
    
    fill(255,130,72);
    noStroke();
    triangle(t_carrot.x_pos-12,t_carrot.y_pos-15,
             t_carrot.x_pos+3,t_carrot.y_pos-15,
             t_carrot.x_pos-3,t_carrot.y_pos+25);
    triangle(t_carrot.x_pos+12,t_carrot.y_pos-15,
             t_carrot.x_pos,t_carrot.y_pos-15,
             t_carrot.x_pos+3,t_carrot.y_pos+25);
    ellipse(t_carrot.x_pos,t_carrot.y_pos+10,10,35);
    ellipse(t_carrot.x_pos,t_carrot.y_pos-15,22,4);
    
    stroke(255);
    strokeWeight(1);
    line(t_carrot.x_pos-11,t_carrot.y_pos-10,
         t_carrot.x_pos-1,t_carrot.y_pos-10);
    line(t_carrot.x_pos+8,t_carrot.y_pos-4,
         t_carrot.x_pos+3,t_carrot.y_pos-4);
    line(t_carrot.x_pos-7,t_carrot.y_pos+3,
         t_carrot.x_pos-3,t_carrot.y_pos+3);

}

// Function to check character has collected the carrot.
function checkCarrot(t_carrot)
{
    if(dist(gameChar_world_x, gameChar_y, t_carrot.x_pos, t_carrot.y_pos) < t_carrot.size)
    {
        console.log("found");
        t_carrot.isFound = true;
        carrot_score += 1;
        coinSound.play();
    }
}


// -----------------------------------
// Flagpole render and check functions
// -----------------------------------

function renderFlagpole()
{
    push()
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250 );
    fill(171, 220, 255);
    noStroke();
    
    if(flagpole.isReached)
    {
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
    }
    
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 15)
    {
        flagpole.isReached = true;
    }
}

// ----------------------------
// Player lives render function
// ----------------------------

function drawPlayerLives(t_lives)
{
    push();
    scale(0.6)
    
    //ears
    fill(255);
    stroke(0);
    strokeWeight(0.5);
    ellipse(t_lives.x-6,t_lives.y-37,8,30);
    ellipse(t_lives.x+6,t_lives.y-37,8,30);
    fill(255, 191, 246);
    ellipse(t_lives.x-6,t_lives.y-37,4,18);
    ellipse(t_lives.x+6,t_lives.y-37,4,18);
    
    //head
    fill(255);
    ellipse(t_lives.x,t_lives.y-17,35,30);
    
    //eyes
    fill(0);
    noStroke();
    ellipse(t_lives.x-10,t_lives.y-18,5);
    ellipse(t_lives.x+10,t_lives.y-18,5);
    
    //mouth
    stroke(0);
    strokeWeight(0.5);
    beginShape(LINES);
    vertex(t_lives.x-2,t_lives.y-9);
    vertex(t_lives.x,t_lives.y-6);
    vertex(t_lives.x,t_lives.y-6);
    vertex(t_lives.x+2,t_lives.y-9);
    endShape();
    
    //blush
    stroke(0);
    strokeWeight(1);
    stroke(255, 191, 246);
    noFill();
    line(t_lives.x-7,t_lives.y-15,t_lives.x-4,t_lives.y-17);
    line(t_lives.x-4,t_lives.y-15,t_lives.x-1,t_lives.y-17);
    line(t_lives.x-1,t_lives.y-15,t_lives.x+2,t_lives.y-17);
    line(t_lives.x+2,t_lives.y-15,t_lives.x+5,t_lives.y-17);
    
    //hands
    fill(255);
    stroke(0);
    strokeWeight(0.5);
    ellipse(t_lives.x-20,t_lives.y-18,5);
    ellipse(t_lives.x+20,t_lives.y-18,5);
    
    //legs
    ellipse(t_lives.x-8,t_lives.y-1,9,6);
    ellipse(t_lives.x+8,t_lives.y-1,9,6);
    pop();
}


// ---------------------
// Score render function
// ---------------------

function drawScore()
{
    push();
    scale(0.8);
    noStroke();
    
    fill(250,196,0);
    ellipse(score.x_pos,score.y_pos,score.size-20,score.size-10);
    
    fill(252,214,73);
    ellipse(score.x_pos-5,score.y_pos,score.size-20,score.size-10);
    
    fill(250,196,0);
    beginShape();
    vertex(score.x_pos-12,score.y_pos+10);
    vertex(score.x_pos-15,score.y_pos-3);
    vertex(score.x_pos-9,score.y_pos);
    vertex(score.x_pos-5,score.y_pos-13);
    vertex(score.x_pos-1,score.y_pos);
    vertex(score.x_pos+5,score.y_pos-3);
    vertex(score.x_pos+2,score.y_pos+10);
    endShape(CLOSE);
    pop();
}

// ----------------------------
// Carrot score render function
// ----------------------------

function drawCarrotscore()
{
    push();
    scale(0.8);
    fill(92,198,98);
    stroke(255);
    ellipse(carrotscore.x_pos-5,carrotscore.y_pos-18,8,12);
    ellipse(carrotscore.x_pos+5,carrotscore.y_pos-18,8,12);
    ellipse(carrotscore.x_pos,carrotscore.y_pos-22,8,18);
    
    fill(255,130,72);
    noStroke();
    triangle(carrotscore.x_pos-12,carrotscore.y_pos-15,
             carrotscore.x_pos+3,carrotscore.y_pos-15,
             carrotscore.x_pos-3,carrotscore.y_pos+25);
    triangle(carrotscore.x_pos+12,carrotscore.y_pos-15,
             carrotscore.x_pos,carrotscore.y_pos-15,
             carrotscore.x_pos+3,carrotscore.y_pos+25);
    ellipse(carrotscore.x_pos,carrotscore.y_pos+10,10,35);
    ellipse(carrotscore.x_pos,carrotscore.y_pos-15,22,4);
    
    stroke(255);
    strokeWeight(1);
    line(carrotscore.x_pos-11,carrotscore.y_pos-10,
         carrotscore.x_pos-1,carrotscore.y_pos-10);
    line(carrotscore.x_pos+8,carrotscore.y_pos-4,
         carrotscore.x_pos+3,carrotscore.y_pos-4);
    line(carrotscore.x_pos-7,carrotscore.y_pos+3,
         carrotscore.x_pos-3,carrotscore.y_pos+3);
    pop();
}


// -------------------------
// check player die function
// -------------------------

function checkPlayerDie()
{   
    if(gameChar_y > height + 50)
    {
        lives.length -= 1;
        if(lives.length > 0)
        {
            startGame();
        }
    }
}

function nextLevel()
{
    setup();
}

function returnToStart()
{
    setup();
}


//This platform implementation is to create several platforms in my game project, have the character jump on and off it. Through this implementation, I've learnt how to create platforms using the factory pattern method. I implemented a few platforms of different length and height in my game. At the start, there were issues with the game character jumping onto the platform, and figured that the character was not jumping 'high' enough. Than, there were issues with the character not being able to jump while it is on the platform. After asking around and rewatching the Coursera videos, I created a for loop that if the the game character is on the platform and the spacebar is pressed, the game character would jump. I managed to get it solved, and the character is now able to jump from one platform to another platform of a higher height.
// -----------------------------------
// Platform render and check functions
// -----------------------------------

function createPlatforms(x, y, length)
{
    var p = {
                x: x,
                y: y,
                length: length,
                draw: function()
                {  
                    fill(176, 255, 176);
                    rect(this.x, this.y, this.length, 10, 10);  
                },
        
                checkContact: function(gc_x, gc_y)
                {
                    if(gc_x > this.x && gc_x < this.x + this.length)
                    {
                        var d = this.y - gc_y;
                        if(d >= 0 && d < 5)
                        {
                            return true;
                        }
                    }
                    return false;
                }
            }
    
    return p;
}


//I've implemented enemies in my game project, whereby when the game character touches the enemy, it loses a life and have to start again at the starting point. I have made my enemies such that they moves at a random speed between 0.5 to 1.5. One thing I find it difficult about this implementation of enemies in the game is to get the game character to lose a live when it has touched an enemy. The 'checkContact' function did not work quite well at the start, but after rewatching the videos on Cousera, I managed to figure it out. Also, working with the curve vertex when drawing the 'ghost' has been hard as well. It was a bit confusing at first but I managed to get it work and look like how I wanted it to be. Through implementing this video, I am more aware of the use of constructor functions, and how to implement it.
// -----------------------------------
// Enemy render and check functions
// -----------------------------------

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = random(0.5,1.5);
    var left = false;
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1;
            left = true;
        }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
            left = false;
        }
    }
    this.draw = function()
    {
        this.update();
        if(left == true)
        {
            fill(255);
            noStroke();
            ellipse(this.currentX, this.y-30, 30, 30);//head
            
            fill(255);
            strokeWeight(1);
            ellipse(this.currentX-12, this.y-12,4,10);//hand1

            noStroke();
            beginShape();//tail
            curveVertex(this.currentX, this.y);
            curveVertex(this.currentX-13, this.y-30);
            curveVertex(this.currentX-13, this.y-15);
            curveVertex(this.currentX+5, this.y+3);
            curveVertex(this.currentX+30, this.y+10);
            curveVertex(this.currentX+18, this.y-10);
            curveVertex(this.currentX+13, this.y-30);
            curveVertex(this.currentX, this.y);
            endShape();
            
            stroke(170);
            ellipse(this.currentX+6, this.y-12,4,10);//hand2
            noStroke();
            rect(this.currentX+2, this.y-20,7,7);
            
            fill(0);
            ellipse(this.currentX-10, this.y-30,5);//eye1
            ellipse(this.currentX, this.y-30,5);//eye2
            ellipse(this.currentX-5, this.y-20,4,7);//mouth
            
        }
        else
        {
            fill(255);
            noStroke();
            ellipse(this.currentX, this.y-30, 30, 30);//head
            
            fill(255);
            strokeWeight(1);
            ellipse(this.currentX+12, this.y-12,4,10);//hand1

            noStroke();
            beginShape();//tail
            curveVertex(this.currentX, this.y);
            curveVertex(this.currentX+13, this.y-30);
            curveVertex(this.currentX+13, this.y-15);
            curveVertex(this.currentX-5, this.y+3);
            curveVertex(this.currentX-30, this.y+10);
            curveVertex(this.currentX-18, this.y-10);
            curveVertex(this.currentX-13, this.y-30);
            curveVertex(this.currentX, this.y);
            endShape();
            
            stroke(170);
            ellipse(this.currentX-6, this.y-12,4,10);//hand2
            noStroke();
            rect(this.currentX-10, this.y-20,7,7);
            
            fill(0);
            ellipse(this.currentX+10, this.y-30,5);//eye1
            ellipse(this.currentX, this.y-30,5);//eye2
            ellipse(this.currentX+5, this.y-20,4,7);//mouth
        }
    }
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        
        if(d < 20)
        {
            return true;
        }
        
        return false;
    }
}