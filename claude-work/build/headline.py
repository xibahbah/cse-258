tbl = results.set_index("Model"); base = "Popularity"; nd = f"NDCG@{TOP_K}"
d_best = per_user[best]["NDCG"].mean() - per_user[base]["NDCG"].mean(); lo, hi = ci(boot[best]["NDCG"] - boot[base]["NDCG"])
order = tbl[nd].sort_values(ascending=False); runner = order.index[1]
d_run = order.iloc[0] - order.iloc[1]; lo2, hi2 = ci(boot[best]["NDCG"] - boot[runner]["NDCG"])
rand_hr = np.mean(TOP_K / ncand_test)
bu = by_user.loc[[best, base]]; bi = by_item.loc[[best, base]]
cov = beyond.set_index("Model")["Coverage@10"]
als_b, als_w = tbl.loc["ALS (binary)", nd], tbl.loc["ALS (playtime-weighted)", nd]
lo3, hi3 = ci(boot["ALS (playtime-weighted)"]["NDCG"] - boot["ALS (binary)"]["NDCG"])
display(Markdown(f"""
**Headline result (test set, {n_users:,} users, {n_items:,} games).**
- **{best}** is best on {nd} ({order.iloc[0]:.4f}); ranking of models: {" > ".join(f"{k} ({v:.4f})" for k, v in order.items())}.
- Versus Popularity: Δ{nd} = **{d_best:+.4f}** (95% paired-bootstrap CI [{lo:+.4f}, {hi:+.4f}]), a relative change of **{d_best / per_user[base]["NDCG"].mean():+.0%}**.
- Versus the best course model, {runner}: Δ{nd} = **{d_run:+.4f}** (95% CI [{lo2:+.4f}, {hi2:+.4f}]), a relative change of {d_run / order.iloc[1]:+.0%}.
- Sanity check: Random HR@{TOP_K} = {tbl.loc["Random", f"HR@{TOP_K}"]:.4f} vs. theoretical {rand_hr:.4f}.
- Coverage@{TOP_K}: Popularity {cov["Popularity"]:.1%} vs. {best} {cov[best]:.1%}.
- On *tail* held-out games, {nd} is {bi.loc[best].iloc[-1]:.4f} for {best} vs. {bi.loc[base].iloc[-1]:.4f} for Popularity; on *head* games it is {bi.loc[best].iloc[0]:.4f} vs. {bi.loc[base].iloc[0]:.4f}.
- Playtime weighting in ALS: {als_w:.4f} (weighted) vs. {als_b:.4f} (binary); difference {als_w - als_b:+.4f} (95% CI [{lo3:+.4f}, {hi3:+.4f}]).

**Do the outside checks agree?**
- Reference library, same ALS settings: {ref_df.iloc[0]["implicit library NDCG@10"]:.4f} vs. our {ref_df.iloc[0]["hand-written NDCG@10"]:.4f}. With factors doubled the library reaches {ref_df.iloc[1]["implicit library NDCG@10"]:.4f}, still below {best} at {order.iloc[0]:.4f}.
- Reference library BPR: {ref_df.iloc[2]["implicit library NDCG@10"]:.4f} vs. our {ref_df.iloc[2]["hand-written NDCG@10"]:.4f}.
- Across {len(split_scores)} splits the largest standard deviation of any model's {nd} is {split_df["sd across splits"].max():.4f}; the gap between {best} and {runner} is {d_run:.4f}. Model ordering identical on every split: **{same_order}**.
- Hiding a recently played game instead of a random one: {best} {recent_df.loc[best].iloc[1]:.4f} vs. {runner} {recent_df.loc[runner].iloc[1]:.4f} vs. Popularity {recent_df.loc[base].iloc[1]:.4f} on {len(eval_rec):,} users.
"""))
