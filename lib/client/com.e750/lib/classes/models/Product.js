import Model from './Model';

export default class Product extends Model {
	constructor (props = {}, options = {}) {
		super(props, options);

		this.defaults = {
			name: '',
			sku: '',
			price: '',
			description: '',
			status: '',
			accolades_01: '',
			additional_description: '',
			aging: '',
			alcohol: '',
			appellation: '',
			blend: '',
			bottle_count: '',
			bottle_size: '',
			case_production: '',
			country: '',
			farming_method: '',
			featured_product: '',
			free_shipping: '',
			harvest_date: '',
			image: '',
			image_alt: '',
			max_purchase_quantity: '',
			new_product: '',
			not_availible_message: '',
			oak: '',
			ph: '',
			qb_account: '',
			qb_class: '',
			qb_sku: '',
			region: '',
			release_date: '',
			residual_sugar: '',
			retail_price: '',
			short_description: '',
			soil: '',
			starting_quantity: '',
			status_availability: '',
			subtitle: '',
			sub_region: '',
			ta: '',
			upc: '',
			varietal: '',
			vineyard: '',
			vintage: '',
			winemaker: '',
			wine_type: '',
			categories: { // this should be an array
				2: {
					id: '',
					name: '',
					sort: ''
				}
			},
			quantity: '',
			quantities: '',
			cost: '',
			image_alt_3: '',
			no_comparison: '',
			shipping_offer_min: '',
			label: '',
			review: '',
			tasting_notes_pdf: '',
			product_category: '',
			reviewer: '',
			tax_exempt: '',
			score: '',
			min_purchase_quantity: 0
		};
	}
}

export {Product as ProductModel};

