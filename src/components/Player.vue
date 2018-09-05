<template>
    <div class="player">
        <h1>{{ currentChapter }}</h1>
    </div>
</template>

<script>
    import {serverBus} from '../main';
    import tool from '../tool';

    export default {
        name: 'Player',
        data: function () {
            return {
                currentChapter: null,
                currentTargetURL: null,
            }
        },
        created() {
            const player = this;
            serverBus.$on('play', function (chapter) {
                if (chapter) player.play(chapter)
            });
        },
        methods: {
            play(chapter) {
                if (this.currentChapter && this.currentChapter.id && this.currentChapter.id === chapter.id
                    && this.currentChapter.channel_id && this.currentChapter.channel_id === chapter.channel_id) {
                    // already playing
                    return;
                }

                this.currentChapter = chapter;
                this.loadTargetURL(chapter);
            },
            loadTargetURL(chapter) {
                if (chapter.file_path) {
                    this.currentTargetURL = 'https://od.qingting.fm/m4a/' + chapter.file_path;
                } else {
                    // this program requires auth
                    if (this.$parent.accessToken && this.$parent.userId)
                        this.currentTargetURL = tool.generateSignedURL(
                            chapter.channel_id,
                            chapter.id,
                            this.$parent.accessToken,
                            this.$parent.userId
                        )
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
