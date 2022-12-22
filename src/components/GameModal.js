import React, { useState } from 'react'

export default function GameModal({ game }) {
    // saved progress is retrived from browser cache or a default save is generated
    const progress = JSON.parse(localStorage.getItem("Actually-Misha.Adventure")) || {
        inventory:[],
        path:game.paths[0]
    };

    // variables are created for ease of use throughout script
    let inventory = progress.inventory;
    let currentPath = progress.path;


    // game text/buttons must be updated in accordance with the active game-option
    const [gameText, setGameText] = useState(generateTextElement(currentPath));
    const [gameButtons, setGameButtons] = useState(generateButtonElements(currentPath));



    // an element for the game's text is generated based on the current option/path
    function generateTextElement(gamePath) {
        return (
            <div className="play-space">
                <p>{gamePath.text}</p>
                <h2><span style={{"color":"red"}}>Available actions:</span></h2>
            </div>
        )
    }

    // some game-buttons should not be accessible without certain requirements having been met
    function meetReqs(gameOption) {
        if(!gameOption.requirements) return true;

        let reqsMet = 0;
        for(let i = 0; i < gameOption.requirements.length; i++) {
            if(gameOption.requirements[i] in inventory) reqsMet++;
        }

        if(reqsMet === gameOption.requirements.length) return true; 

        return false;
    }

    // buttons are generated via each stage/levels listed options/actions
    function generateButtonElements(gamePath) {
        const options = gamePath.options;

        // default buttons such as inventory and save are created
        var buttons = [<button key="inventory" className="btn" onClick={() => {
            if (inventory.length === 0) alert("Your inventory is empty!")
            else {
                var output = "You have:\n";
                for(let i = 0; i < inventory.length; i++) {
                    output += `- ${inventory[i]}\n`
                }
                alert(output);
            }
        }}>Open invetory</button>, <button key="save" className="btn" onClick={() => {
            localStorage.setItem("Actually-Misha.Adventure", JSON.stringify({inventory:inventory,path:currentPath}));
            alert("Your progress has been saved!");
        }}>Save game</button>];
        
        // button elements are created for each option/action within the current game-path
        for(let i = 0; i < gamePath.options.length; i++) {
            // if an options requirements have not been met, it will not be listed as an available option.
            if(!meetReqs(options[i])) continue;
            buttons.push(
                <button key={snowflake()} className="btn" onClick={() => {
                    // The button will load the options corresponding path when clicked
                    if(options[i].gain) inventory.push(options[i].gain);
                    loadPath(options[i].nextId);
                }}>{options[i].text}</button>
            )
        }

        // return a list containing our generated button elements
        return buttons;
    }

    // used to generate a pseudo-random 12 digit ID code
    function snowflake() {
        const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var output = "";
        for(let i = 0; i < 12; i++) {
            output += nums[Math.floor(Math.random()*nums.length)];
        }
        return output;
    }

    // iteratively search for the specified path and (if found) load it
    function loadPath(gamePath) {
        for(let i = 0; i < game.paths.length; i++) {
            const path = game.paths[i];
            if (path.id === gamePath) {
                // the game text and buttons are updated to match the new path
                setGameText(generateTextElement(path));
                setGameButtons(generateButtonElements(path));
                currentPath = path

                break;
            }
        }
    }



    return (
        <div className="sub-container">
            {gameText}
            {gameButtons}
        </div>
    )
}
