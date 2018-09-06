<template>
    <div class="source-input needs-validation">
        <div class="input-group">
            <input class="form-control" :class="(sourceUrl && !UrlIsValid)?'is-invalid':''" type="text"
                   title="Source Page URL"
                   placeholder="Input source page URL here."
                   v-model="sourceUrl" @input="validateUrl">
            <button title="Submit" class="submit btn input-group-prepend btn-primary" :disabled="disableSubmit"
                    @click="urlSubmit">
                Submit
            </button>
            <div class="invalid-feedback">
                Please input a valid URL from QingtingFM page.
            </div>
        </div>

    </div>
</template>

<script>
    import {serverBus} from '../main';

    export default {
        name: 'SourceInput',
        data: function () {
            return {
                sourceUrl: "",
                UrlIsValid: true,
                disableSubmit: true,
                channelId: null,
                page: 1
            }
        },
        methods: {
            urlSubmit: function () {
                this.validateUrl();
                if (this.UrlIsValid) {
                    this.disableSubmit = true;
                    this.$parent.channelId = this.channelId;
                    this.$parent.page = this.page;
                    this.$cookies.set('channel_id', this.channelId)
                        .set('page', this.page)
                        .set('source_url', this.sourceUrl);
                    serverBus.$emit('urlSubmit');
                }
            },
            validateUrl: function () {
                if (this.sourceUrl) {
                    const regex = /^[htps]+:\/\/www\.qingting\.fm\/channels\/(\d+)\/?(\d+)?/;
                    let [, channel, page] = this.sourceUrl.match(regex) || [];
                    channel = parseInt(channel);
                    page = parseInt(page) ? parseInt(page) : 1;

                    if (channel) {
                        // URL is valid QingtingFM page
                        this.channelId = channel;
                        this.page = page;
                        this.disableSubmit = false;
                        this.UrlIsValid = true;
                        return;
                    }
                }

                this.UrlIsValid = false;
                this.disableSubmit = true;
            },
        },
        mounted() {
            const sourceUrl = this.$cookies.get('source_url');

            if (sourceUrl) {
                this.sourceUrl = sourceUrl;
            }
        }
    }
</script>

<style scoped>
    div.source-input {
        margin-bottom: 15px;
    }

    .source-input input {
        max-width: 500px;
        margin-left: auto;
    }

    button.submit {
        margin-right: auto;
    }
</style>