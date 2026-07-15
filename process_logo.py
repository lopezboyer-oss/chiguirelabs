import cv2
import numpy as np

def process_logo(input_path, output_logo_path, output_favicon_path):
    # Read the image with alpha channel
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print(f"Could not read {input_path}")
        return

    # Assuming img has 4 channels (BGRA)
    if img.shape[2] != 4:
        print("Image does not have an alpha channel")
        return

    # Extract channels
    b, g, r, a = cv2.split(img)

    # 1. CLEAN THE EDGES & ADD CONTOUR
    # Create a mask where alpha is greater than a threshold to remove anti-aliasing artifacts
    _, binary_mask = cv2.threshold(a, 100, 255, cv2.THRESH_BINARY)
    
    # We want to remove the white/grey fringe. 
    # Usually this means shrinking the mask slightly (erosion)
    kernel = np.ones((2,2), np.uint8)
    eroded_mask = cv2.erode(binary_mask, kernel, iterations=1)

    # Now let's create a contour around the eroded mask
    # Dilate the eroded mask to get the contour area
    dilated_mask = cv2.dilate(eroded_mask, kernel, iterations=2)
    contour_mask = cv2.subtract(dilated_mask, eroded_mask)

    # Base image with cleaned alpha
    b_clean = cv2.bitwise_and(b, b, mask=eroded_mask)
    g_clean = cv2.bitwise_and(g, g, mask=eroded_mask)
    r_clean = cv2.bitwise_and(r, r, mask=eroded_mask)

    # Color for the contour: Magenta (#ff00ff) -> BGR: (255, 0, 255)
    # Or Cyan (#00e5c3) -> BGR: (195, 229, 0)
    # Let's use Magenta for high contrast against the dark background
    contour_color = (255, 0, 255)

    # Apply contour color where contour_mask is 255
    b_out = np.where(contour_mask == 255, contour_color[0], b_clean)
    g_out = np.where(contour_mask == 255, contour_color[1], g_clean)
    r_out = np.where(contour_mask == 255, contour_color[2], r_clean)
    
    # The new alpha is the dilated mask (body + contour)
    a_out = dilated_mask

    # Combine back to BGRA
    logo_outlined = cv2.merge((b_out, g_out, r_out, a_out))

    # Anti-alias the final alpha slightly (blur the alpha channel)
    a_out_blurred = cv2.GaussianBlur(a_out, (3,3), 0)
    # Threshold again to keep it crisp but soft edges
    _, a_out_blurred = cv2.threshold(a_out_blurred, 127, 255, cv2.THRESH_BINARY)
    logo_outlined = cv2.merge((b_out, g_out, r_out, a_out_blurred))

    # Save the outlined logo
    cv2.imwrite(output_logo_path, logo_outlined)
    print(f"Saved {output_logo_path}")

    # 2. CREATE THE FAVICON (White silhouette)
    # We use the eroded mask as the shape
    fav_b = np.full_like(b, 255)
    fav_g = np.full_like(g, 255)
    fav_r = np.full_like(r, 255)
    
    favicon = cv2.merge((fav_b, fav_g, fav_r, eroded_mask))
    
    # Resize favicon to 64x64 for better icon usage
    favicon_resized = cv2.resize(favicon, (64, 64), interpolation=cv2.INTER_AREA)
    cv2.imwrite(output_favicon_path, favicon_resized)
    print(f"Saved {output_favicon_path}")

if __name__ == "__main__":
    process_logo("logo.png", "logo.png", "favicon.png")
