#!/bin/bash
# cleanup-images.sh - Remove old Docker images, keep last N versions for rollback
KEEP=2  # Nombre d'images à conserver (current + previous)

for repo in ghcr.io/mateja-velickovic/todoapp-backend ghcr.io/mateja-velickovic/todoapp-frontend; do
  echo "Cleaning $repo (keeping last $KEEP versions)..."

  # Get unique image IDs sorted by creation date (newest first), deduplicated
  IMAGE_IDS=$(docker images "$repo" --format "{{.ID}}\t{{.CreatedAt}}" | \
    sort -t$'\t' -k2 -r | \
    awk -F'\t' '!seen[$1]++{print $1}')

  # Count how many unique images we have
  TOTAL=$(echo "$IMAGE_IDS" | grep -c . || true)

  if [ "$TOTAL" -le "$KEEP" ]; then
    echo "  Only $TOTAL unique image(s) found, nothing to clean."
    continue
  fi

  # Get the IDs of images to remove (skip the first KEEP)
  TO_REMOVE=$(echo "$IMAGE_IDS" | tail -n +$((KEEP + 1)))

  for img_id in $TO_REMOVE; do
    # Find all tags referencing this image ID so we can untag + remove
    TAGS=$(docker images "$repo" --format "{{.ID}}\t{{.Repository}}:{{.Tag}}" | \
      grep "^${img_id}" | awk -F'\t' '{print $2}')

    for tag in $TAGS; do
      echo "  Removing $tag (image $img_id)"
      docker rmi "$tag" 2>/dev/null || true
    done
  done
done

echo "Cleanup complete."