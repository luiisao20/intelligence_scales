import { reactive } from "vue";

export function useModal () {

    const modalElements = reactive({
        title: '',
        type: '',
        submit: true,
    })

    const showModal = (title, submit, options = { variant: 'info'}) => {
        modalElements.title = title;
        modalElements.type = options.variant;
        modalElements.submit = submit
    }

    return { 
        modalElements, showModal
    }
}