<template>
    <nav class="navbar navbar-expand-lg navbar-light account">
        <a class="navbar-brand" href="https://www.qingting.fm/"><img src="../assets/logo.png"/></a>
        <div class="account-wrapper">
            <template v-if="user">
                <span class="username">
                    您好，{{user.username}}
                </span>
                <button class="logout btn btn-dark btn-sm" @click="logout">登出</button>
            </template>
            <span v-else-if="$parent.callbackCode" class="alert alert-secondary" role="alert">加载中，请稍候</span>
            <button v-else @click="beginLogin" class="btn btn-primary btn-sm">登录
            </button>
        </div>
    </nav>
</template>

<script>
    import {serverBus} from '../main';

    export default {
        name: 'Account',
        props: [],
        data: function () {
            return {
                sourceUrl: null,
                loginUrl: 'https://sss.qingting.fm/account/wechat-passport.html?redirect_uri='
                    + window.location.origin + window.location.pathname,
                user: null
            }
        },
        computed: {
            userInquiryURL: function () {
                if (this.$parent.userId)
                    return 'https://u2.qingting.fm/u2/api/v4/user/' + this.$parent.userId
            }
        },
        methods: {
            beginLogin: function () {
                window.location = this.loginUrl;
            },
            updateUserInfo: function () {
                if (this.$parent.userId) {
                    this.axios.get(this.userInquiryURL)
                        .then(response => {
                            if (response && response.data && response.data.data) {
                                this.user = response.data.data;
                            }
                        });
                }
            },
            logout: function () {
                this.user = null;
                serverBus.$emit('logout')
            }
        },
        created() {
            const account = this;
            serverBus.$on('userChange', function () {
                account.updateUserInfo()
            });
        }
    }
</script>

<style scoped>
    div.account-wrapper {
        margin-left: auto;
    }

    .navbar-brand img {
        width: 220px;
    }

    span.username {
        white-space: nowrap;
        position: absolute;
        right: 71px;
        bottom: 20px;
    }
</style>