<template>
    <div v-if="channel">
        <div class="text-left list">
            <div class="row album">
                <div class="album-image-wrapper">
                    <img class="album" :src="channel.img_url">
                </div>
                <div class="col">
                    <h4>{{channel.name}}</h4>
                    <div>
                        <span>主播：</span>
                        <template v-for="podcaster in channel.podcasters">
                            <span :key='podcaster.id'>
                                <img class="avatar" :src="forceHttps(podcaster.img_url)">{{podcaster.name}}</span>
                        </template>
                    </div>
                    <div>
                        <span>播放：</span>
                        <span>{{channel.playcount}}</span>
                        <span>最近更新：</span>
                        <span>{{channel.update_time}}</span>
                    </div>
                </div>
            </div>
            <div>
                <span class="text-muted">介绍：</span>
                <span>{{channel.desc}}</span>
            </div>
        </div>

        <div class="text-left">
            <div class="row">
                <div class="col">
                    <h6>专辑列表 | 共{{channel.program_count}}个节目 | {{page}}/{{numPages}}页 </h6>
                </div>
                <div class="col">
                    <div class="button-wrapper">
                        <button :class="'btn btn-link'+(page===1?' disabled':'')" @click="prevPage">上一页</button>
                        <select class="page-select" v-bind:value="page" @change="jumpToPage">
                            <option :key="pageNo" v-for="pageNo in numPages">
                                {{pageNo}}
                            </option>
                        </select>
                        <button :class="'btn btn-link'+(page===numPages?' disabled':'')" @click="nextPage">下一页
                        </button>
                    </div>
                </div>
            </div>
            <table class="table table-sm">
                <thead>
                <th>节目名</th>
                <th>时长</th>
                <th>播放量</th>
                <th>更新时间</th>
                </thead>
                <tbody>
                <tr v-if="cIndex>=displayOffset&&cIndex<displayOffset+pageSize"
                    v-for="(chapter, cIndex) in chapters" :key="chapter.id+'_'+channel.id"
                    :class="currentPlayIndex>-1 && currentPlayIndex===cIndex?'playing':''"
                >
                    <td>
                        <button class="btn btn-link chapter" @click="playChapter(cIndex)">
                            {{chapter.name}}
                        </button>
                        <span v-if="!chapter.file_path" class="badge badge-danger">收费</span>
                    </td>
                    <td>{{formatSeconds(chapter.duration)}}</td>
                    <td>{{chapter.playcount}}</td>
                    <td>{{chapter.update_time}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import {serverBus} from '../main';

    export default {
        name: 'List',
        data: function () {
            return {
                page: 1,
                channel: null,
                chapters: [],
                pageSize: 10,
                currentPlayIndex: -1,
                displayOffset: 0
            }
        },
        computed: {
            channelInfoUrl: function () {
                return 'https://i.qingting.fm/wapi/channels/' + this.$parent.channelId;
            },
            numPages: function () {
                if (this.channel) {
                    return Math.ceil(this.channel.program_count / this.pageSize);
                } else {
                    return 0;
                }
            }
        },
        created() {
            const list = this;
            // Using the service bus
            serverBus.$on('urlSubmit', function () {
                list.loadPageFromParent();
                list.loadChannelAndChapters();
            });

            serverBus.$on('requestNextChapter', function () {
                const nextIndex = list.currentPlayIndex + 1;
                if (nextIndex >= list.channel.program_count) {
                    // no next chapter
                    return false;
                }

                const nextChapterPage = Math.floor(nextIndex / list.pageSize) + 1;
                list.page = nextChapterPage;
                if (list.chapters[nextIndex]) {
                    // next chapter is ready
                    list.playChapter(nextIndex);
                    list.updateDisplayChapters()
                } else {
                    // next chapter is not loaded
                    list.loadChaptersByPage(nextChapterPage, () => {
                        list.playChapter(nextIndex);
                        list.updateDisplayChapters()
                    })
                }

            });
        },
        mounted() {
            this.loadPageFromParent();
            this.loadChannelAndChapters();
        },
        methods: {
            forceHttps: function (URL) {
                return URL.replace(/^http:/, 'https:')
            },
            getChapterListUrl: function (previewPage) {
                return 'https://i.qingting.fm/wapi/channels/' + this.$parent.channelId + '/programs/page/'
                    + (previewPage ? previewPage : this.page) + '/pagesize/' + this.pageSize;
            },
            formatSeconds(seconds) {
                let secOnly = Math.round(seconds % 60);
                let minOnly = Math.floor(seconds / 60 % 60);
                let hourOnly = Math.floor(seconds / 3600);

                secOnly = secOnly > 10 ? secOnly : (secOnly > 0 ? ('0' + secOnly) : '00');
                minOnly = minOnly > 10 ? minOnly : (minOnly > 0 ? ('0' + minOnly) : '00');
                hourOnly = hourOnly ? hourOnly : '';

                return hourOnly ? hourOnly + ':' : (minOnly + ':' + secOnly)
            },
            loadPageFromParent() {
                const parentPage = parseInt(this.$parent.page);
                this.page = parentPage ? parentPage : this.page;
            },
            loadChannelAndChapters: function () {
                this.loadChannel(this.loadChapters)
            },
            loadChannel: function (callback) {
                if (!this.$parent.channelId) return false;
                if ((this.numPages && this.page > this.numPages) || this.page <= 0) this.page = 1;
                this.axios.get(this.channelInfoUrl)
                    .then(response => {
                        if (response && response.data && response.data.data) {
                            const channelInfo = response.data.data;
                            if (Object.keys(channelInfo).length) {
                                this.channel = channelInfo;
                                // edit image URL
                                channelInfo.img_url = this.forceHttps(channelInfo.img_url);
                                if (callback && typeof callback === "function") callback()
                            }
                        }
                    })
            },
            loadChapters: function () {
                if (!this.channel) return;
                this.updateDisplayChapters();
            },
            loadChaptersByPage: function (page, callback) {
                if (!this.channel) return;
                const offset = (page - 1) * this.pageSize;

                for (let i = 0; i < this.pageSize; i++) {
                    if (this.chapters[i + offset]) return (callback && typeof callback === "function") ? callback() : null;
                }

                this.axios.get(this.getChapterListUrl(page))
                    .then(response => {
                        if (response && response.data && response.data.data) {
                            const chapterList = response.data.data;
                            if (chapterList.length) {
                                chapterList.forEach((chapter, index) => {
                                    this.$set(this.chapters, index + offset, chapter);
                                    if (callback && typeof callback === "function") return callback()
                                });
                            }
                        }
                    })
            },
            updateDisplayChapters: function () {
                const list = this;
                this.$cookies.set("page", this.page);
                this.loadChaptersByPage(this.page, () => {
                    list.displayOffset = (list.page - 1) * list.pageSize
                });
            },
            nextPage: function () {
                if (this.page < this.numPages) {
                    this.page += 1;
                    this.updateDisplayChapters()
                }
            },
            prevPage: function () {
                if (this.page > 1) {
                    this.page -= 1;
                    this.updateDisplayChapters()
                }
            },
            jumpToPage: function (event) {
                const pageNo = parseInt(event.target.value);
                if (pageNo > 0 && pageNo <= this.numPages) {
                    this.page = pageNo;
                    this.updateDisplayChapters()
                }
            },
            playChapter: function (index) {
                serverBus.$emit('play', this.chapters[index], this.channel);
                this.currentPlayIndex = index;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    img.avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
    }

    img.album {
        width: 100px;
        height: 100px;
        border-radius: 1px;
    }

    .row.album {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .album-image-wrapper {
        padding-right: 15px;
        padding-left: 15px;
    }

    h6 {
        margin-top: 20px;
    }

    span {
        font-size: 13px;
    }

    table td {
        font-size: 13px;
    }

    table th {
        font-size: 14px;
    }

    tr.playing {
        border-left: solid #cc0000 2px;
        font-weight: 500;
        background-color: #f7f7f7;
    }

    button.chapter {
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 0;
        font-size: 13px;
    }

    .button-wrapper {
        bottom: 0;
        position: absolute;
        right: 3px;
    }
</style>
