Vue.component("view-image", {
    template: "#view-image",
    props: ["imageId"],
    data: function () {
        return {
            title: "",
            description: "",
            category: "",
            path: "",
        };
    },
    
    mounted: function () {
        this.selectImage();
        
    },
    watch: {
        imageId: function () {
            this.selectImage();
        },
    },
    methods: {
        closeWindow: function () {
            this.$emit("close");
        },
        selectImage: function () {
            console.log("this.imageId: ", this.imageId);
            axios
                .get(`/images/${this.imageId}`)
                .then((res) => {
                    
                    this.title = res.data.title;
                    this.description = res.data.description;
                    this.category = res.data.category;
                    this.path = res.data.path;
                                
                })
                .catch((err) => {
                    console.log("Error in getting image: ", err);
                });
        },
    },
});

Vue.component("image-list", {
    template: "#image-list",
    props: [],
    data: function () {
        return {
            images: [],
            title: "",
            description: "",
            category: "",
            path: "",
        };
    },
    
    mounted: function () {
        var self = this; 
        axios.get("/images").then(function (res) {
            self.images = res.data;
            console.log("#image-list - Images mounted: ", self.images);           
        });   
    },
    
    watch: {
        images: function () {
            console.log("#image-list - Image-list changed");
            
        },
    },

    methods: {
        
            deleteImage: function(imageId) {
            console.log("imageId: ", imageId)
            axios
                .get(`/images/delete/${imageId}`)
                .then((res) => {
                    console.log("#image-list - File being deleted - res.data: ", res.data);
                    console.log("#image-list - Before deletion - this.images: ", this.images);
                    
                    for (i = 0; i < this.images.length; i++) {
                    if (this.images[i].id === imageId)
                    {this.images.splice(i, 1);
                    return this.images}
                    }; 
                    
                    console.log("#image-list - After deletion - this.images: ", this.images);
                })
                .catch((err) => {
                    console.log("#image-list - Error in delete image: ", err);
                })
        },

    },
});


new Vue({
    el: "#main", 
    data: {
        
        images: [],
        categories: [],
        title: "",
        description: "",
        category: "",
        path: "",
        file: null,
        imageId: null,
        renderComponent: false,
        csrf: document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content"),
    },
    mounted: function () {
        var self = this; 
        axios.get("/images").then(function (res) {
            self.images = res.data;
            console.log("#main - Images mounted: ", self.images);
            
            
        });   

        if (location.hash) {
            self.toggleImage(location.hash.slice(1));
        }
        addEventListener("hashchange", function () {
            console.log("location.hash: ", location.hash);
            self.toggleImage(location.hash.slice(1));
        });

        

        
    },

    computed: {
    sortedCategories: function () {
      var categories = {};
      return this.images.filter(function (images) {
        if (categories[images.category]) return false;
        return categories[images.category] = true;
      })
    }
    },

    methods: {

        setSelectedCategory: function(category) {
            console.log("category: ", category)
            axios
                .get(`/category/${category}`)
                .then((res) => {
                    this.categories = res.data;
                    console.log("#main - this.categories: ", this.categories)
                })
                .catch((err) => {
                    console.log("#main - Error in getting category: ", err);
                })
                           
                
        },

        closeWindow: function () {
            this.$emit("close");
        },

        deleteImage: function(imageId) {
            console.log("imageId: ", imageId)
            axios
                .get(`/images/delete/${imageId}`)
                .then((res) => {
                    console.log("#main - Image to be deleted: ", res.data);
                    console.log("#main - Images prior to deletion: ", this.images);
                    for (i = 0; i < this.images.length; i++) {
                    if (this.images[i].id === imageId)
                    {this.images.splice(i, 1);
                    return this.images}
                    }; 
                    console.log("#main - Images after deletion: ", this.images);
                })
                .catch((err) => {
                    console.log("#main - Error in delete image: ", err);
                })
        },
        

        handleChange: function (e) {
            console.log("File selected - e.target.files[0]: ", e.target.files[0]);
            this.file = e.target.files[0];
        },

        submitFile: function () {
            console.log("#main - submitFile is running...");

            var formData = new FormData();
            formData.append("file", this.file);
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("category", this.category);
            formData.append('_csrf', this.csrf);
            console.log("#main - formData: ", formData);

            axios
                .post("/upload", formData)
                .then((res) => {
                    console.log("#main - Uploading image");
                    console.log("#main - Uploaded object: ", res.data);
                    this.images.unshift(res.data);
                    this.title = "";
                    this.description = "";
                    this.category = "";
                    console.log("#main - Updated image array: ", this.images);
                    
                })
                .catch((err) => {
                    console.log("Error in upload: ", err);
                });
        },
        toggleImage: function (imageId) {
            this.imageId = imageId;
            console.log("imageId: ", imageId);
        },
        closeWindow: function () {
            this.imageId = null;
            location.hash = "";
            history.pushState({}, "", "/");
        },
        
    }
    
});

