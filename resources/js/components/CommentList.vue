
<template>
    <div>
        <div v-if="loading">
            Загрузка комментариев...
        </div>

        <div v-else-if="error">
            {{ error }}
        </div>

        <div v-else>
            <div>
                <label for="sort-field">Сортировать по:</label>
                <select id="sort-field" v-model="sortBy">
                    <option value="id">ID</option>
                    <option value="date">Дате</option>
                </select>

                <label for="sort-order">Порядок:</label>
                <select id="sort-order" v-model="sortOrder">
                    <option value="asc">По возрастанию</option>
                    <option value="desc">По убыванию</option>
                </select>
            </div>

            <p v-if="sortedComments.length === 0">
                Комментариев пока нет.
            </p>

            <article
                v-for="comment in paginatedComments"
                :key="comment.id"
            >
                <h3>{{ comment.name }}</h3>
                <p>{{ comment.text }}</p>
                <small>{{ comment.date }}</small>

                <button
                    type="button"
                    @click="deleteComment(comment.id)"
                >
                    Удалить
                </button>
            </article>
            <div v-if="pageCount > 1">
                <button
                    type="button"
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                >
                    Назад
                </button>

                <button
                    v-for="page in pageCount"
                    :key="page"
                    type="button"
                    :disabled="currentPage === page"
                    @click="currentPage = page"
                >
                    {{ page }}
                </button>

                <button
                    type="button"
                    :disabled="currentPage === pageCount"
                    @click="currentPage++"
                >
                    Далее
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            sortBy: 'id',
            sortOrder: 'asc',
            currentPage: 1,
            pageSize: 3,
        }
    },

    computed: {
        comments() {
            return this.$store.getters.comments
        },

        loading() {
            return this.$store.getters.loading
        },

        error() {
            return this.$store.getters.error
        },

        sortedComments() {
            return [...this.comments].sort((a, b) => {
                let result

                if (this.sortBy === 'date') {
                    const dateA = new Date(a.date).getTime()
                    const dateB = new Date(b.date).getTime()

                    result = dateA - dateB
                } else {
                    result = Number(a.id) - Number(b.id)
                }

                return this.sortOrder === 'asc'
                    ? result
                    : -result
            })
        },

        pageCount() {
            return Math.ceil(this.sortedComments.length / this.pageSize)
        },

        paginatedComments() {
            const start = (this.currentPage - 1) * this.pageSize

            return this.sortedComments.slice(
                start,
                start + this.pageSize
            )
        }
    },

    methods: {
        async deleteComment(id) {
            const confirmed = window.confirm(
                'Удалить этот комментарий?'
            )

            if (!confirmed) {
                return
            }

            try {
                await axios.delete(`/api/comments/${id}`)
                this.$store.commit('REMOVE_COMMENT', id)
                if (this.currentPage > this.pageCount) {
                this.currentPage = Math.max(1, this.pageCount)
}
            } catch (error) {
                console.error('Ошибка удаления:', error)
                alert('Не удалось удалить комментарий')
            }
        }
    }
}
</script>
