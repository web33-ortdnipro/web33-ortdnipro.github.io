    const GITHUB_USER 	= "web33-ortdnipro";
    const GITHUB_TOKEN 	= atob("Y2FkOWNmYTBhNDBkYzcwNzU4NThkNTM1ZDVjNGNkMjcyMmJhNDI0Yg==");

    const REPS_URL = `https://api.github.com/users/${GITHUB_USER}/repos`;
        
    const appOptions = {

        methods: {
            copyToClipboard(event) {
                event.target.previousElementSibling.select();
                document.execCommand("copy"); 
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
            }
        },

        data() {
            return {
                repositoriesList: [],
                groupTitle: 'WEB33',
                groupFullTitle: 'WEB33@ORTDNIPRO',
                totalLessonQuantity: 24,
                showPPTX: false, 
                searchText: '',
                showGitHubLinkAfter: 10
            }
        },

        async mounted() {
            let answer = await fetch(REPS_URL, {
                headers:{
                    "Authorization": `token ${GITHUB_TOKEN}`
                }
            }); 
            
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


    

        
        
