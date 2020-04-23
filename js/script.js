


/**
 * This runs the entire code
 * the .ready function just means to wait until the page is completely loaded
 */
$(document).ready(function(){


    //url from api
    const Purl = "https://randomuser.me/api/?results=12&nat=gb&inc=name,email,location,phone,picture,dob"

    //container for search bar
    const $search = $(".search-container");

    //form for search container
    const form = document.createElement("form");


    /**
     * this function creates a modal and card for each user
     * @param {json obj}- a list of user objects in json
     */
    function generateHTML(data)
    {

        /**
         * for each person in the data,
         * create a card and modal
         */
        data.forEach((user, index) =>
        {
            //the HTML for the gallery
            let gallery = $("#gallery");

            //the HTML for creating a proper date of birth
            let rawDob = user.dob.date;
            let dob = rawDob.slice(0,10);

            //the card copies and pastes info from the user to create a html element
            card = Array.from($(`
                <div class="card" id="${index}">
                <div class="card-img-container">
                <img class="card-img" src="${user.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                </div>
                </div>
            `));

            //the modal copies and pastes info from the user to create a html element
            modal = Array.from($(`
                <div class="modal-container" href="${index}">
                <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${user.phone}</p>
                <p class="modal-text">${user.location.street}, ${user.location.city}, ${user.location.postcode}</p>
                <p class="modal-text">Birthday:${dob} </p>
                </div>
                </div>
                <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
                </div>
            `));

            //this appends the 
            gallery.append(card);
            gallery.append(modal);

            //hides the modals until clicked in the event listener below
            $(".modal-container").hide();

        });//end of forEach loop

        /**
         * this uses the modaliterator function to iterate through several different 
         */
        $("div .card").on("click", (e) =>
        {
            let cardClickedOn = $(e.target).closest(".card");

            if (e.type === "click")
            {
                $(`[href = '${cardClickedOn[0].id}']`).show();
                modalIterator();
            }
        });//end of Event listener

    }


    /**
     * this function allows for iteration of the modals when they are clicked in the display function
     */
    function modalIterator ()
    {
        //the close prev and next buttons for the modals
        const close = $("#modal-close-btn");
        const prev = $("#modal-prev");
        const next = $("#modal-next");

        $("[type = 'button']").on("click", function(e)
        {
            let buttonClickedOn = $(e.target).closest("[type='button']");
            let currentCard = $(e.target).closest(".modal-container");
            let getCard = $(".modal-container")[0].getAttribute("href");
            let raw = currentCard[0].getAttribute("href");
            let num = parseInt(raw);


            
            //if the close button is clicked, hide the modals again
            if (buttonClickedOn[0].id === "modal-close-btn")
            {
                $(".modal-container").hide();
                num = 0;
            }

            //if the prev button is picked go back one or iterate from the back if you are at the front
            else if (buttonClickedOn[0].id === "modal-prev")
            {
                currentCard.hide();

                if (num === 0)
                {
                $("[href = '11']").show();
                }
                else
                {
                num -= 1;
                $(`[href = '${num}']`).show();
                };
            }

            //if the next button is clicked, go forward or go back to the begining to iterate through again
            else if (buttonClickedOn[0].id === "modal-next")
            {
                currentCard.hide();

                if (num ===11)
                {
                $("[href = '0']").show();
                }
                else
                {
                num += 1;
                $(`[href = '${num}']`).show();
                }

            }

        });

    }



    /**
     * fetches data and displays it onto the cards
     * (also the modals but they are hidden)
     */
    fetch(Purl)
        .then(response => response.json())
        .then(data => generateHTML(data.results))
        .catch(error => console.error(error));




    /**
    * creation of the search bar and appending it to the form tag
    */
    form.innerHTML =
    `<input type="text" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">`;
    $search.append(form);



    /**
     * creates a search function
     * iterates through the cards to see if any match the info in the search bar
     * puts the search and names in lower case to make it easier to compare
     */
    const searchFun = function()
    {
        //the literal input of the search bar
        let input = ($("#search-input")[0].value).toLowerCase();

        //iterates through each card
        for (let i = 0; i < $(".card").length; i ++)
        {

        //the names of the cards
        const nameh3 = $(".card h3")[i];
        const name = (nameh3.innerHTML).toLowerCase();

        //if it is the same name as the input search
        if (name.includes(input))
        {
            nameh3.closest(".card").style.display = "";
        }
        else
        {
            nameh3.closest(".card").style.display = "none";
        }
        }

    };

    /**
     * when something is typed in the search bar
     * display the card that matches
     */
    $search.on('keyup', searchFun);


});