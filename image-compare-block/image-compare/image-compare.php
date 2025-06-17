<?php

/**
 * Plugin Name:       Image Compare
 * Description:       a WordPress block that allows you to showcase two images with a draggable slider.
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      8.3
 * Author:            Maryory Arrieta (arrimc)
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       image-compare
 *
 * @package CreateBlock
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

function create_block_image_compare_block_init()
{

	if (function_exists('wp_register_block_types_from_metadata_collection')) {
		wp_register_block_types_from_metadata_collection(__DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php');
		return;
	}

	if (function_exists('wp_register_block_metadata_collection')) {
		wp_register_block_metadata_collection(__DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php');
	}

	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach (array_keys($manifest_data) as $block_type) {
		register_block_type(__DIR__ . "/build/{$block_type}");
	}
}
add_action('init', 'create_block_image_compare_block_init');

//load script in frontend
function image_compare_frontend_script()
{
	wp_enqueue_script(
		'image-compare-frontend',
		plugins_url('build/image-compare/view.js', __FILE__),
		array(),
		'1.0',
		true
	);
}
add_action('wp_enqueue_scripts', 'image_compare_frontend_script');
