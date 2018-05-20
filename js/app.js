
/* ======= Model ======= */

var model = {
    currentCat: null,
    currentCatIndex: 0,
    cats: [
        {
            clickCount : 0,
            name : 'Tabby',
            imgSrc : 'img/434164568_fea0ad4013_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/bigtallguy/434164568'
        },
        {
            clickCount : 0,
            name : 'Tiger',
            imgSrc : 'img/4154543904_6e2428c421_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/xshamx/4154543904'
        },
        {
            clickCount : 0,
            name : 'Scaredy',
            imgSrc : 'img/22252709_010df3379e_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/kpjas/22252709'
        },
        {
            clickCount : 0,
            name : 'Shadow',
            imgSrc : 'img/1413379559_412a540d29_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/malfet/1413379559'
        },
        {
            clickCount : 0,
            name : 'Sleepy',
            imgSrc : 'img/9648464288_2516b35537_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/onesharp/9648464288'
        }
    ]
};


/* ======= Octopus ======= */

var octopus = {

    init: function() {
        // set our current cat to the first one in the list
        model.currentCat = model.cats[0];

        // tell our views to initialize
        catListView.init();
        catView.init();
        catAdminView.init();
    },

    getCurrentCat: function() {
        return model.currentCat;
    },

    getCats: function() {
        return model.cats;
    },

    // set the currently-selected cat to the object passed in
    setCurrentCat: function(cat, catIndex) {
        model.currentCat = cat;
        model.currentCatIndex = catIndex;
    },

    // increments the counter for the currently-selected cat
    incrementCounter: function() {
        model.currentCat.clickCount++;
        catView.render();
    },
    
    // hide the cat admin form
    hideAdminForm: function() {
        catAdminView.adminForm.form.hidden = true;
    },
    
    // show the cat admin form and fill in current cat data
    showAdminForm: function() {
        // First, fill in current cat data in the admin form fields
        this.updateAdminFormValues();
        
        // Then show the admin form
        catAdminView.adminForm.form.hidden = false;
    },
    
    updateAdminFormValues: function() {
        catAdminView.adminForm.name.value = model.currentCat.name;
        catAdminView.adminForm.url.value = model.currentCat.imgSrc;
        catAdminView.adminForm.counter.value = model.currentCat.clickCount;
    },
    
    updateCatData: function() {
        // 3 things need to be updated: model, cat list view and cat view area
        
        // Updating the Model: Update current cat and cats list
        // Updating the current cat
        model.currentCat.name = catAdminView.adminForm.name.value;
        model.currentCat.imgSrc = catAdminView.adminForm.url.value;
        model.currentCat.clickCount = catAdminView.adminForm.counter.value;
        
        // Updating the cat list
        model.cats[model.currentCatIndex].name = catAdminView.adminForm.name.value;
        model.cats[model.currentCatIndex].imgSrc = catAdminView.adminForm.url.value;
        model.cats[model.currentCatIndex].clickCount = catAdminView.adminForm.counter.value;
        
        
        // Updating the cats list view and cat view area
        catListView.render();
        catView.render();
        
        
        // Hide the admin form
        this.hideAdminForm();
    }
    
};


/* ======= View ======= */

var catView = {

    init: function() {
        // store pointers to our DOM elements for easy access later
        this.catElem = document.getElementById('cat');
        this.catNameElem = document.getElementById('cat-name');
        this.catImageElem = document.getElementById('cat-img');
        this.countElem = document.getElementById('cat-count');

        // on click, increment the current cat's counter
        this.catImageElem.addEventListener('click', function(){
            octopus.incrementCounter();
        });

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        // update the DOM elements with values from the current cat
        var currentCat = octopus.getCurrentCat();
        this.countElem.textContent = currentCat.clickCount;
        this.catNameElem.textContent = currentCat.name;
        this.catImageElem.src = currentCat.imgSrc;
    }
};

var catListView = {

    init: function() {
        // store the DOM element for easy access later
        this.catListElem = document.getElementById('cat-list');

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        var cat, elem, i;
        // get the cats we'll be rendering from the octopus
        var cats = octopus.getCats();

        // empty the cat list
        this.catListElem.innerHTML = '';

        // loop over the cats
        for (i = 0; i < cats.length; i++) {
            // this is the cat we're currently looping over
            cat = cats[i];

            // make a new cat list item and set its text
            elem = document.createElement('li');
            elem.textContent = cat.name;

            // on click, setCurrentCat and render the catView
            // (this uses our closure-in-a-loop trick to connect the value
            //  of the cat variable to the click event function)
            elem.addEventListener('click', (function(catCopy, iCopy) {
                return function() {
                    octopus.setCurrentCat(catCopy, iCopy);
                    catView.render();
                    catAdminView.render();
                };
            })(cat, i));

            // finally, add the element to the list
            this.catListElem.appendChild(elem);
        }
    }
};

var catAdminView = {
    init: function() {
        // Store DOM elements for easy access later
        this.adminButton = document.getElementById('admin-button');
        this.adminForm = {};
        this.adminForm.form = document.getElementById('admin-form');
        this.adminForm.name = document.getElementById('admin-form')[0];
        this.adminForm.url = document.getElementById('admin-form')[1];
        this.adminForm.counter = document.getElementById('admin-form')[2];
        this.adminForm.save = document.getElementById('admin-form')[3];
        this.adminForm.cancel = document.getElementById('admin-form')[4];
        
        // Make the admin button shows the admin form
        this.adminButton.addEventListener('click', function() {
            octopus.showAdminForm();
        });
        
        // Add functionality to form "Save" and "Cancel" buttons
        this.adminForm.save.addEventListener('click', function() {
           octopus.updateCatData(); 
        });
        this.adminForm.cancel.addEventListener('click', function() {
            octopus.hideAdminForm();
        });
        
        // Make the admin form hidden by default
        octopus.hideAdminForm();
        
    },
    
    render: function() {
        octopus.updateAdminFormValues();
    }
};

// make it go!
octopus.init();
