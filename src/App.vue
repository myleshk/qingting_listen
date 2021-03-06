<template>
    <div id="app" class="container">
        <Account></Account>
        <SourceInput></SourceInput>
        <Player></Player>
        <List></List>
    </div>
</template>

<script>
    import Account from './components/Account.vue'
    import SourceInput from './components/SourceInput.vue'
    import List from './components/List.vue'
    import Player from './components/Player.vue'
    import {serverBus} from './main';

    export default {
        name: 'app',
        components: {
            Account,
            List,
            Player,
            SourceInput
        },
        props: [],
        data: function () {
            return {
                userId: null,
                refreshToken: null,
                accessToken: null,
                callbackCode: this.$route.query.code,
                refreshAuthURL: 'https://u2.qingting.fm/u2/api/v4/auth',
                channelId: null,
                page: 1,
                authExpire: null
            }
        },
        computed: {
            callbackAuthURL: function () {
                if (this.callbackCode)
                    return 'https://u2.qingting.fm/u2/api/v4/wechat_callback?code=' + this.callbackCode
            }
        },
        methods: {
            currentTS() {
                return Math.round(new Date().valueOf() / 1000)
            },
            refreshAuth() {
                if (this.authExpire > 0 && this.currentTS() < this.authExpire) {
                    // not expired, skip refreshing
                    return;
                }

                this.axios.post(this.refreshAuthURL, {
                    grant_type: 'refresh_token',
                    refresh_token: this.refreshToken,
                    qingting_id: this.userId
                }, {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(response => {
                        if (response && response.data && response.data.data) {
                            this.saveLoginAuthData(response.data.data);
                        }
                    });
            },
            getAuthDataFromCookies: function () {
                this.userId = this.$cookies.get("user_id");
                this.refreshToken = this.$cookies.get("refresh_token");
                this.accessToken = this.$cookies.get("access_token");
            },
            /**
             * This is for both in-house login and WeChat login
             * @param authData
             */
            saveLoginAuthData: function (authData) {
                this.refreshToken = authData.refresh_token;
                this.accessToken = authData.access_token;
                this.userId = authData.qingting_id;
                this.authExpire = authData.expires_in + this.currentTS();
                this.$cookies.set("user_id", this.userId, authData.expires_in)
                    .set("refresh_token", authData.refresh_token, authData.expires_in)
                    .set("access_token", authData.access_token, authData.expires_in);
                serverBus.$emit('userChange', this.userId);
            },

            loadChannelPage: function () {
                const channel = this.$cookies.get('channel_id');
                const page = this.$cookies.get('page');

                if (parseInt(channel)) this.channelId = parseInt(channel);
                if (parseInt(page)) this.page = parseInt(page);
            }
        },
        created() {
            if (this.callbackAuthURL) {
                this.axios.get(this.callbackAuthURL)
                    .then(response => {
                        if (response && response.data && response.data.data) {
                            this.saveLoginAuthData(response.data.data);
                        }
                        this.$router.push({path: '/'});
                    })
            } else {
                this.getAuthDataFromCookies();
                this.refreshAuth()
            }

            this.loadChannelPage();

            const app = this;
            serverBus.$on('play', function () {
                app.refreshAuth();
            });

            serverBus.$on('logout', function () {
                app.saveLoginAuthData({});
            });

            serverBus.$on('loginSuccess', function (authData) {
                app.saveLoginAuthData(authData)
            })
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
