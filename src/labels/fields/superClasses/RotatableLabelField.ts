import { RotatableField } from './interfaces';
import LabelField from './LabelField';
import { Rotation } from "@/commands";

export default abstract class RotatableLabelField extends LabelField implements RotatableField {
    protected rotation: Rotation = 0

    setRotation(rotation: Rotation) {
        this.rotation = rotation
    }
    getRotation() {
        return this.rotation
    }
}