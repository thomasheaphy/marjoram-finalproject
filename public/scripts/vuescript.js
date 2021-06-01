Vue.component("view-image", {
    template: "#view-image",
    props: ["imageId"],
    data: function () {
        return {
            title: "",
            description: "",
            category: "",
            path: "",
            created_at: "",
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
                    (this.title = res.data.title),
                    (this.description = res.data.description),
                    (this.category = res.data.category),
                    (this.path = res.data.path)                  
                })
                .catch((err) => {
                    console.log("Error in getting image: ", err);
                });
        },
    },
});

Vue.component("display-images", {
    template: "#display-images",
    props: ["category"],
    data: function () {
        return {
            title: "",
            description: "",
            category: "",
            path: "",
            created_at: "",
        };
    },
    
    mounted: function () {
        this.specifyImages();
    },
    watch: {
        category: function () {
            this.specifyImages();
        },
    },
    methods: {
        specifyImages: function () {
            console.log("this.category: ", this.category);
            axios
                .get(`/${this.category}`)
                .then((res) => {
                    (this.category = res.data.category),
                    (this.title = res.data.title),
                    (this.description = res.data.description),
                    (this.path = res.data.path)                        
                })
                .catch((err) => {
                    console.log("Error in getting category: ", err);
                });
        },
    },
});





new Vue({
    el: "main", // ELement it's in charge of
    data: {
        // Keeps track of variables, changes
        images: [],
        title: "",
        description: "",
        category: "",
        path: "",
        created_at: "",
        file: null,
        imageId: null,
        renderComponent: false,
    },
    mounted: function () {
        var self = this; 
        axios.get("/images").then(function (res) {
            self.images = res.data;
            console.log("images data: ", self.images)
            
        });
        if (location.hash) {
            self.toggleImage(location.hash.slice(1));
        }
        addEventListener("hashchange", function () {
            console.log("location.hash: ", location.hash);
            self.toggleImage(location.hash.slice(1));
        });
    },
    methods: {
        handleChange: function (e) {
            console.log("e.target.files[0]: ", e.target.files[0]);
            console.log("this: ", this);
            this.file = e.target.files[0];
        },

        submitFile: function () {
            console.log("submitFile is running...");

            var formData = new FormData();
            console.log("this.file: ", this.file)
            formData.append("file", this.file);
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("category", this.category);
            console.log("formData: ", formData);

            axios
                .post("/upload", formData)
                .then((res) => {
                    console.log("Uploading image");
                    this.images.unshift(res.data);
                    this.title = "";
                    this.description = "";
                    this.category = "";
                   
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
        }
    },
});

new Vue({
    el: "header", 
    data: {
        images: [],
        title: "",
        description: "",
        category: "",
        path: "",
        created_at: "",
        file: null,
        imageId: null,
        renderComponent: false,
    },
    mounted: function () {
        var self = this; 
        axios.get("/images").then(function (res) {
            self.images = res.data;
            console.log("images data: ", self.images)
                
    })
    },
    computed: {
    sortedCategories: function () {
      var categories = {};
      return this.images.filter(function (images) {
        if (categories[images.category]) return false;
        return categories[images.category] = true;
      })
    }
}
    
});
