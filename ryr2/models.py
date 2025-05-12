from django.db import models


class RYR2Variant(models.Model):
    """
    Django model mapped to the existing SQL view / table
    `sub_tmp_AM_REVEL_againstALL_2_adj`.
    """
    class Meta:
        managed = False
        app_label = "azure_data"
        db_table = "[RyR2].[sub_tmp_AM_REVEL_againstALL_2_adj]"

    resnum = models.IntegerField(blank=True, null=True)
    var = models.TextField(primary_key=True, blank=False, null=False)

    hg19_pos = models.IntegerField(blank=True, null=True)
    grch38_pos = models.IntegerField(blank=True, null=True)

    ref = models.TextField(blank=True, null=True)
    alt = models.TextField(blank=True, null=True)

    aaref = models.TextField(blank=True, null=True)
    aaalt = models.TextField(blank=True, null=True)

    revel = models.FloatField(db_column="REVEL", blank=True, null=True)
    alpha_missense_value = models.FloatField(
        db_column="Alpha.missense.value", blank=True, null=True
    )

    total_carriers = models.IntegerField(blank=True, null=False, default=0)
    unaff = models.IntegerField(blank=True, null=False, default=0)
    cpvt = models.IntegerField(db_column="CPVT", blank=True, null=False, default=0)

    clinvar_annotation = models.TextField(
        db_column="ClinVar_annotation", blank=True, null=True
    )
    annotation_score = models.TextField(
        db_column="Annotation_score", blank=True, null=True
    )
    weight = models.TextField(blank=True, null=True)
    penetrance_cpvt = models.TextField(
        db_column="penetrance_cpvt", blank=True, null=True
    )
    cpvt_penetrance_bayesian_initial = models.TextField(
        db_column="cpvt_penetranceBayesian_initial", blank=True, null=True
    )
    cpvt_penetrance_bayesian = models.TextField(
        db_column="cpvt_penetranceBayesian", blank=True, null=True
    )
    cpvt_dist = models.TextField(db_column="cpvt_dist", blank=True, null=True)
    cpvt_dist_weight = models.TextField(
        db_column="cpvt_dist_weight", blank=True, null=True
    )
    hotspot = models.TextField(blank=True, null=True)

    p_mean_w = models.FloatField(blank=True, null=True)
    prior_mean = models.FloatField(blank=True, null=True)
    alpha = models.FloatField(blank=True, null=True)
    beta = models.TextField(blank=True, null=True)

    def __str__(self) -> str:
        return self.var