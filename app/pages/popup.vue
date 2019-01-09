<template>
    <div id="app">
        <v-app id="options">
            <v-toolbar flat dark color="grey darken-4">
                <v-card-title
                        class="headline spacedLetters upperCase ml-2"
                        v-html="getLocale('popupHeadline')"
                />
            </v-toolbar>

            <v-data-table
                    :headers="headers"
                    :items="bookmarks"
                    class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                    <td class="text-no-wrap">{{ props.item.name }}</td>
                    <td>{{ props.item.url }}</td>
                    <!--<td><a href="{{ props.item.url }}">{{ props.item.name }}</a></td>-->
                    <!--<td class="text-xs-right"><a href="{{ props.item.url }}">{{ props.item.url }}</a></td>-->
                </template>
            </v-data-table>
        </v-app>
    </div>
</template>
<script>
    import * as util from '../scripts/util';

    export default {
        methods: {
            getLocale(text) {
                return util.getLocale(text);
            },
            loadSettings() {
            }
        },
        data() {
            return {
                headers: [
                    { text: 'Name', align: 'left', value: 'name' },
                    { text: 'Url', value: 'url' },
                ],
                bookmarks: [
                    {
                        value: false,
                        name: 'QOwnNotes',
                        url: 'https://www.qownnotes.org',
                    },
                    {
                        value: false,
                        name: 'Getting Started Tutorial',
                        url: 'https://developer.chrome.com/extensions/getstarted',
                    },
                    {
                        value: false,
                        name: 'Test',
                        url: '123',
                    },
                ]
            }
        },
        mounted() {
            this.loadSettings();
        },
        watch: {
        }
    };
</script>
