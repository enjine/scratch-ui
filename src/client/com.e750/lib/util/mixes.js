export default function mixes (...behaviors) {
    return target => behaviors.forEach(behavior => {
        let b = behavior.prototype || behavior;

        Object.assign(target.prototype, b);
    });
}
