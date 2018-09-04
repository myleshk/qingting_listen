<template>
    <div v-if="channel">
        <div class="text-left list">
            <div class="row">
                <div class="album-image-wrapper">
                    <img class="album" :src="channel.img_url">
                </div>
                <div class="col">
                    <h4>{{channel.name}}</h4>
                    <div>
                        <span>主播：</span>
                        <template v-for="podcaster in channel.podcasters">
                            <span :key='podcaster.id'>
                                <img class="avatar" :src="podcaster.img_url">{{podcaster.name}}</span>
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

        <div v-if="chapters" class="text-left">
            <h6>专辑列表 | 共{{channel.program_count}}个节目 | {{page}}/{{numPages}}页 </h6>
            <table class="table table-sm">
                <thead>
                <th>节目名</th>
                <th>时长</th>
                <th>播放量</th>
                <th>更新时间</th>
                </thead>
                <tbody>
                <tr v-for="chapter in chapters" :key="chapter.res_id">
                    <td>
                        <a :href="'/channels/'+channelId+'/programs/'+chapter.id">
                            {{chapter.name}}
                        </a>
                    </td>
                    <td>{{Math.round(chapter.duration/60)}}分{{Math.round(chapter.duration%60)}}秒</td>
                    <td>{{chapter.playcount}}</td>
                    <td>{{chapter.update_time}}</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td colspan="4">
                        <button v-if="page>1" class="btn-link btn" @click="prevPage">上一页</button>
                        <template v-for="pageNo in numPages">
                            <button class="btn btn-link text-muted" :key="pageNo" v-if="pageNo === page">
                                <strong>{{pageNo}}</strong>
                            </button>
                            <button v-else class="btn-link btn" :key="pageNo" @click="jumpToPage(pageNo)">
                                {{pageNo}}
                            </button>
                        </template>
                        <button v-if="page<numPages" class="btn-link btn" @click="nextPage">下一页</button>
                    </td>
                </tr>
                </tfoot>
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
                channelId: null,
                page: 1,
                channel: null,
                chapters: null
            }
        },
        computed: {
            channelInfoUrl: function () {
                return 'https://i.qingting.fm/wapi/channels/' + this.channelId;
            },
            chapterListUrl: function () {
                return 'https://i.qingting.fm/wapi/channels/' + this.channelId + '/programs/page/' + (parseInt(this.page) ? parseInt(this.page) : 1) + '/pagesize/10';
            },
            numPages: function () {
                if (this.channel) {
                    return Math.ceil(this.channel.program_count / 10);
                } else {
                    return 0;
                }
            }
        },
        created() {
            const channel = this.$cookies.get('channel_id');
            const page = this.$cookies.get('page');

            if (parseInt(channel)) this.channelId = parseInt(channel);
            if (parseInt(page)) this.page = parseInt(page);

            const that = this;
            // Using the service bus
            serverBus.$on('urlSubmit', function (data) {
                console.log(data);

                that.loadChannelInfo();
                that.loadChapters()
            });
        },
        mounted() {
            this.loadChannelInfo();
            this.loadChapters()
        },

        methods: {
            loadChannelInfo: function () {
                if (!this.channelId) return false;
                this.axios.get(this.channelInfoUrl)
                    .then(response => {
                        if (response && response.data && response.data.data) {
                            const channelInfo = response.data.data;
                            if (Object.keys(channelInfo).length) {
                                this.channel = channelInfo;
                            }
                        }
                    })
            },
            loadChapters: function () {
                if (!this.channelId) return false;
                this.axios.get(this.chapterListUrl)
                    .then(response => {
                        if (response && response.data && response.data.data) {
                            const chapterList = response.data.data;
                            if (Object.keys(chapterList).length) {
                                this.chapters = chapterList;
                            }
                        }
                    })
            },
            nextPage: function () {
                if (this.page < this.numPages) {
                    this.page += 1;
                    this.loadChapters()
                }
            },
            prevPage: function () {
                if (this.page > 1) {
                    this.page -= 1;
                    this.loadChapters()
                }
            },
            jumpToPage: function (pageNo) {
                console.log(pageNo)
                if (pageNo > 0 && pageNo <= this.numPages) {
                    this.page = pageNo;
                    this.loadChapters()
                }
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
        width: 170px;
        height: 170px;
        border-radius: 1px;
    }

    .row {
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

    a {
        color: #42b983;
    }
</style>
