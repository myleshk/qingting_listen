<template>
    <div class="player-wrapper">
        <aplayer :audio="audio" @ended="next" loop="none" autoplay theme="#000000"></aplayer>
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
                channel: null,
                audio: []
            }
        },
        watch: {
            currentTargetURL: function (targetURL) {
                if (this.currentTargetURL) {
                    this.audio = Object.assign({}, this.audio, {
                        name: this.currentChapter.name,
                        artist: this.channel.podcasters.map(podcaster => podcaster.name).join(','),
                        url: targetURL,
                        cover: this.channel.img_url
                    })
                } else {
                    this.audio = Object.assign({}, this.audio, {})
                }
            }
        },
        created() {
            const player = this;
            serverBus.$on('play', function (chapter, channel) {
                if (chapter) player.play(chapter, channel)
            });
        },
        methods: {
            play(chapter, channel) {
                if (this.currentChapter && this.currentChapter.id && this.currentChapter.id === chapter.id
                    && this.currentChapter.channel_id && this.currentChapter.channel_id === chapter.channel_id) {
                    // already playing
                    return;
                }

                this.channel = channel;
                this.currentChapter = chapter;
                this.loadTargetURL(chapter)
            },
            next() {
                serverBus.$emit('requestNextChapter');
            },
            loadTargetURL(chapter) {
                if (chapter.file_path) {
                    this.currentTargetURL = 'https://od.qingting.fm/' + chapter.file_path;
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