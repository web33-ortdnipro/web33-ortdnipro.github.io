    const appOptions = {

        methods: {
            copyToClipboard(event) {
                event.target.previousElementSibling.select();
                document.execCommand("copy"); 
            },

            getCurrentISOTimeString(){
                return (new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1);
            }
        },

        computed: {
            searchResult() {

                let search = this.searchText.trim().toLowerCase();

                if(!search.length) return this.repositoriesList;
                
                return this
                        .repositoriesList
                            .filter(
                                item => 
                                    item.description.toLowerCase().includes(search)
                                    || 
                                    item.name.toLowerCase().includes(search)
                            );
                
            },

            isNothingFound() {
                return !this.searchResult.length;
            },

            isShowCourseReviewButton(){
                return this.showCourseReviewButton && this.showCourseReviewAfter < this.currentISOTimeString
            }
        },

        data() {
            let titleTag = document.querySelector('title');
            let appDataTag = document.querySelector('title + meta');
            
            console.dir( appDataTag.dataset);

            let dataConfig = {

                repositoriesList: [],
                groupTitle: titleTag.innerHTML.split('@')[0],
                groupFullTitle: titleTag.innerHTML,
                currentISOTimeString: this.getCurrentISOTimeString(),
                showPPTX: false, 
                searchText: '',
                
                ...appDataTag.dataset,
                gitHubToken: atob(appDataTag.dataset.gitHubToken)          
            }

            for(let item in dataConfig){
                dataConfig[item] = String(dataConfig[item]).trim().toLowerCase() === 'true' 
                                    ?   true 
                                    :   String(dataConfig[item]).trim().toLowerCase() === 'false' 
                                            ? false
                                            : dataConfig[item];
            }

            return dataConfig;
        },

        async mounted() {

            const REPS_URL = `https://api.github.com/users/${this.gitHubAccount}/repos`;

            let answer = await fetch(REPS_URL, {
                headers:{
                    "Authorization": `token ${this.gitHubToken}`
                }
            }); 

            if(this.showCourseReviewButton){
                setInterval(() => {
                    this.currentISOTimeString = this.getCurrentISOTimeString();
                }, 10000);
            }
            
            answer = await answer.json();

            this.repositoriesList = answer.filter( 
                item => item.name.trim().toLowerCase().startsWith('lesson')
            ).map(item => ({
                name:           item.name,
                title:          item.name.trim().toLowerCase().replace('lesson', 'Lesson #'),
                description:    item.description,
                lessonNumber:   +item.name.trim().toLowerCase().replace('lesson', ''),
                url:            item.clone_url,
                pdfLink:        `${item.html_url}/raw/${item.default_branch}/${item.name}.pdf`,
                pptxLink:       `${item.html_url}/raw/${item.default_branch}/${item.name}.pptx`
            })).sort( (a, b) => b.lessonNumber - a.lessonNumber );
            
        }

    }

   Vue.createApp(appOptions).mount('#app-container');   