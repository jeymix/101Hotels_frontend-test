
<template>
    <form @submit.prevent="submitComment">
        <div>
            <label for="name">Имя</label>
            <input
                id="name"
                v-model.trim="name"
                type="text"
                required
                maxlength="255"
                placeholder="Ваше имя"
            >
        </div>

        <div>
            <label for="text">Комментарий</label>
            <textarea
                id="text"
                v-model.trim="text"
                required
                placeholder="Напишите комментарий"
            ></textarea>
        </div>

        <button type="submit" :disabled="submitting">
            {{ submitting ? 'Отправка...' : 'Добавить комментарий' }}
        </button>

        <p v-if="error" role="alert">
            {{ error }}
        </p>
    </form>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            name: '',
            text: '',
            submitting: false,
            error: null
        }
    },

    methods: {
        async submitComment() {
            if (!this.name || !this.text || this.submitting) {
                return
            }

            this.submitting = true
            this.error = null

            try {
                const response = await axios.post('/api/comments/', {
                    name: this.name,
                    text: this.text,
                    date: new Date().toISOString()
                })

                const comment = response.data

                if (!comment.id) {
                    throw new Error('API не вернул созданный комментарий')
                }

                this.$store.commit('ADD_COMMENT', comment)

                this.name = ''
                this.text = ''
            } catch (error) {
                console.error('Ошибка добавления комментария:', error)
                this.error = 'Не удалось добавить комментарий. Попробуйте ещё раз.'
            } finally {
                this.submitting = false
            }
        }
    }
}
</script>
