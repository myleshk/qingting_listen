<template>
    <div class="account">
        <div v-if="user" class="alert alert-success" role="alert">
            Logged in as {{user.username}}
        </div>
        <div v-else-if="callbackCode" class="alert alert-secondary" role="alert">
            Loading user info...
        </div>
        <div v-else class="text-right">
            <button @click="beginLogin"
                    class="btn btn-primary">Login
            </button>
        </div>
    </div>
</template>

<script>
    import {serverBus} from '../main';

    export default {
        name: 'Account',
        props: [],
        data: function () {
            return {
                sourceUrl: null,
                UrlIsValid: false,
                disableSubmit: true,
                loginUrl: 'https://sss.qingting.fm/account/wechat-passport.html?redirect_uri='
                    + window.location.origin + window.location.pathname,
                user: null,
                callbackCode: this.$route.query.code,
                authData: null,
                userId: null
            }
        },
        computed: {
            callbackAuthURL: function () {
                return 'https://u2.qingting.fm/u2/api/v4/wechat_callback?code=' + this.callbackCode
            },
            userInquiryURL: function () {
                return 'https://u2.qingting.fm/u2/api/v4/user/' + this.userId
            }
        },
        methods: {
            beginLogin: function () {
                window.location = this.loginUrl;
            },
            updateUserInfo: function () {
                if (this.userId) {
                    this.axios.get(this.userInquiryURL)
                        .then(response => {
                            if (response && response.data && response.data.data) {
                                this.user = response.data.data;
                            }
                        });
                }
            }
        },
        mounted() {
            if (this.callbackCode) {
                this.axios.get(this.callbackAuthURL)
                    .then(response => {
                        if (response && response.data && response.data.data) {
                            this.authData = response.data.data;
                            this.userId = this.authData.qingting_id;
                            this.$cookies.set("user_id", this.userId, this.authData.expires_in)
                                .set("refresh_token", this.authData.refresh_token, this.authData.expires_in);
                            serverBus.$emit('userChange', this.userId);
                        }
                        this.$router.push({path: '/'});
                        this.updateUserInfo()
                    })
            } else {
                this.userId = this.$cookies.get("user_id");
                this.updateUserInfo()
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
